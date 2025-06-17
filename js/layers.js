addLayer("subcount", {
    name: "subcount", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
    points: new Decimal(0),
    }},
    color: "#ff0000",
    requires(){
    let subrequirement=new Decimal(10);
    if (hasUpgrade("subcount", 25)) subrequirement = subrequirement.div(upgradeEffect("subcount", 25));
    return subrequirement;}, // Can be a function that takes requirement increases into account
    resource: "subscribers", // Name of prestige currency
    baseResource: "views", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.48, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade("subcount", 21)) mult = mult.times(upgradeEffect("subcount", 21));
        if (hasUpgrade("subcount", 24)) mult = mult.times(upgradeEffect("subcount", 24));
        if (hasUpgrade("money", 11)) mult = mult.times(upgradeEffect("money", 11));
        if (hasUpgrade("money", 13)) mult = mult.times(upgradeEffect("money", 13));
        if (hasUpgrade("money", 23)) mult = mult.times(upgradeEffect("money", 23));
        if (hasUpgrade("sacrifice", 11)) mult = mult.times(upgradeEffect("sacrifice", 11));
        if (hasUpgrade("prestige", 12)) mult = mult.times(upgradeEffect("prestige", 12));
        if (player.subcount.points.gte(5000000)) mult = mult.div(player.subcount.points.div(5000000).pow(0.2));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "s: Perform subscriber reset", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},

    upgrades: {
        11: {
            title: "Upload Your First Video!",
            description: "Start your channel! Gain +0.25 views per second.",
            cost: new Decimal(1),
            effect() {
                return new Decimal(0.25);
            },
            effectDisplay() { return "+" + format(this.effect()) + " views/sec"; },
        },
        12: {
            title: "Post more videos!",
            description: "You really like posting videos! Gain a view boost based on subscribers.",
            cost: new Decimal(1),
            unlocked() {return hasUpgrade("subcount", 11);},
            effect() {
                return player.subcount.points.times(1.2).add(1).pow(0.225);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        13: {
            title: "Upload a short!",
            description: "You make a short which isn't super OP yet but it's getting there. Boost base view gain by +0.25.",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade("subcount", 12);},
            effect() {
                return new Decimal(0.25);
            },
            effectDisplay() { return "+" + format(this.effect()) + " base views/sec"; },
        },
        14: {
            title: "Getting traction!",
            description: "Boost base view gain based on their amount.",
            cost: new Decimal(3),
            unlocked() {return hasUpgrade("subcount", 13);},
            effect() {
                return player.points.add(10).log10().pow(1.25).div(10);
            },
            effectDisplay() { return "+" + format(this.effect()) + " base views/sec"; },
        },
        15: {
            title: "Add editing!",
            description: "Start improving your videos with editing tools! View gain is multiplied based on time since last subscriber reset.",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("subcount", 14);},
            effect() {
                let subtime=new Decimal(player.subcount.resetTime);
                return subtime.div(50).add(1).pow(0.35);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        21: {
            title: "New style!",
            description: "Experiment with different video styles to see which one works best. Sub gain is multiplied based on time since last subscriber reset.",
            cost: new Decimal(10),
            unlocked() {return hasUpgrade("subcount", 15);},
            effect() {
                let subtime=new Decimal(player.subcount.resetTime);
                return subtime.div(100).add(1).pow(0.325);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        22: {
            title: "The grind begins!",
            description: "You become dedicated to making videos and a few shorts. Boost view gain based on total subs gained.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("subcount", 21);},
            effect() {
                return player.subcount.total.div(4).add(1).pow(0.19);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        23: {
            title: "Going for monetization!",
            description: "You decide you want to be monetized. Your best sub amount boosts view gain further.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade("subcount", 22);},
            effect() {
                return player.subcount.best.div(3).add(1).pow(0.2);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        24: {
            title: "Retention Techniques!",
            description: "You not only gain views, but keep your viewers locked in. Boost sub gain based on their amount.",
            cost: new Decimal(100),
            unlocked() {return hasUpgrade("subcount", 23);},
            effect() {
                return player.subcount.points.div(10).add(1).pow(0.125);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        25: {
            title: "It's getting close!",
            description: "You're within reach! Reduce the subscriber requirement based on their amount.",
            cost: new Decimal(250),
            unlocked() {return hasUpgrade("subcount", 24);},
            effect() {
                return player.subcount.points.div(50).add(1).pow(0.15);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1000 Subscribers",
            effectDescription: "Unlock Monetization!",
            done() { return player.subcount.points.gte(1000); },
        },
        1: {
            requirementDescription: "1000000 Subscribers",
            effectDescription: "Unlock Sacrifice!",
            unlocked(){return hasMilestone("subcount", 0)},
            done() { return player.subcount.points.gte(1000000); },
        },
        2: {
            requirementDescription: "50000000 Subscribers",
            effectDescription: "Unlock Prestige!",
            unlocked(){return hasMilestone("subcount", 1)},
            done() { return player.subcount.points.gte(5e7); },
        },
        3: {
            requirementDescription: "368000000 Subscribers",
            effectDescription: "Surpass MrBeast! Reward: View gain is doubled.",
            unlocked(){return hasMilestone("subcount", 2)},
            done() { return player.subcount.points.gte(3.68e8); },
        },
    },

    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones",
            ],
        },
        "About": {
            content: [
                ["raw-html", () => "The start to your FYSC journey!"],
            ],
        },
    },
});
addLayer("money", {
    name: "money", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "$", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 2, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
    points: new Decimal(0),
    }},
    color: "#00ff00",
    requires(){let moneyrequirement = new Decimal(1000);
        if (hasUpgrade("prestige", 13)) moneyrequirement = moneyrequirement.div(upgradeEffect("prestige", 13));
            return moneyrequirement;},
    base: new Decimal(1.5),
    canBuyMax: false,
    resource: "money", // Name of prestige currency
    baseResource: "subscribers", // Name of resource prestige is based on
    baseAmount() {return player.subcount.points}, // Get the current amount of baseResource
    type: "static", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade("money", 14)) mult = mult.div(upgradeEffect("money", 14));
        if (hasUpgrade("money", 22)) mult = mult.div(upgradeEffect("money", 22));
        if (hasUpgrade("sacrifice", 13)) mult = mult.div(upgradeEffect("sacrifice", 13));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    branches: ["subcount"],
    hotkeys: [
        {key: "m", description: "m: Cash in money", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("subcount", 25);},

    upgrades: {
        11: {
            title: "You finally get monetized!",
            description: " Spend 1 money to increase view and sub gain by 1.5x!",
            cost: new Decimal(1),
            effect() {
                return new Decimal(1.5);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        12: {
            title: "Advertising",
            description: "Use ads to boost your viewership significantly. Total money earned boosts view gain.",
            cost: new Decimal(2),
            unlocked() {return hasUpgrade("money", 11);},
            effect() {
                return player.money.total.div(2).add(1).pow(0.35);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        13: {
            title: "Promotion",
            description: "Use promotions to boost your subcount significantly. Total money earned boosts sub gain.",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("money", 12);},
            effect() {
                return player.money.total.div(4).add(1).pow(0.2);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        14: {
            title: "Memberships",
            description: "Enable memberships so your subs can support your content. Subscribers reduce money's base requirement.",
            cost: new Decimal(8),
            unlocked() {return hasUpgrade("money", 13);},
            effect() {
                return player.subcount.total.div(20000).add(1).pow(0.2);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
        21: {
            title: "Get Sponsored",
            description: "Get a sponsorship which boosts view count based on your best money balance.",
            cost: new Decimal(12),
            unlocked() {return hasUpgrade("money", 14);},
            effect() {
                return player.money.best.div(3).add(1).pow(0.4);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        22: {
            title: "Brand Deals",
            description: "Get brand deals which make money requirement reduce based on view count.",
            cost: new Decimal(17),
            unlocked() {return hasUpgrade("money", 21);},
            effect() {
                return player.points.div(1000000).add(1).pow(0.1);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
        23: {
            title: "Extra High-Quality Videos",
            description: "Your high-quality videos reach a wider audience and make them watch longer! Boost view and sub gain based on total money earned.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("money", 22);},
            effect() {
                return player.money.total.div(6).add(1).pow(0.25);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        24: {
            title: "Invest money to get more money",
            description: "Your high-quality videos reach a wider audience and make them watch longer! Money reduces its own requirement.",
            cost: new Decimal(25),
            unlocked() {return hasUpgrade("money", 23);},
            effect() {
                return player.money.points.div(5).add(1).pow(0.15);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
    },
    milestones: {
        0: {
            requirementDescription: "40 Money",
            effectDescription: "Money boosts view gain based on its amount/10+1.",
            done() { return player.money.points.gte(40); },
        },
    },

    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones",
            ],
        },
        "About": {
            content: [
                ["raw-html", () => "Monetization boosts your FYSC journey!"],
            ],
        },
    },
});
addLayer("sacrifice", {
    name: "sacrifice", // This is optional, only used in a few places, If absent it just uses the layer id.
    image: "https://i.ibb.co/d0thhY6z/bigfiresquaremdmsize95.gif", // This appears on the layer's node as an image
    position: 3, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
    points: new Decimal(0),
    }},
    color: "#D54027",
    requires(){return new Decimal(1000000).times(player.sacrifice.points.div(5).add(1).pow(1.5));},
    effect(){return player.sacrifice.points.add(1).pow(0.2);},
    effectDescription(){return "boosting view gain by x" + format(this.effect());},
    resource: "sacrifice", // Name of prestige currency
    baseResource: "subscribers", // Name of resource prestige is based on
    baseAmount() {return player.subcount.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.75, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        if (hasUpgrade("prestige", 14)) mult = mult.times(upgradeEffect("prestige", 14));
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1);
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    branches: ["money"],
    hotkeys: [
        {key: "1", description: "1: Perform sacrifice", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("money", 23);},

    upgrades: {
        11: {
            title: "Performed the sacrifice!",
            description: "Use the sacrifice to build a multiplier to sub gain, starting at 1.25x.",
            cost: new Decimal(5),
            effect() {
                return player.sacrifice.points.add(1).pow(0.15).times(1.25);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        12: {
            title: "Stronger Sacrifice!",
            description: "This upgrade grants extra view gain based on sacrifice, at ^0.5 effect.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("sacrifice", 11);},
            effect() {
                return player.sacrifice.points.add(1).pow(0.1);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        13: {
            title: "Sacrificial Investment!",
            description: "Use your sacrifice to divide money requirement.",
            cost: new Decimal(40),
            unlocked() {return hasUpgrade("sacrifice", 12);},
            effect() {
                return player.sacrifice.points.add(1).pow(0.3);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1000 Money",
            effectDescription: "Making Those Bucks!",
            done() { return player.sacrifice.points.gte(1000); },
        },
    },

    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones",
            ],
        },
        "About": {
            content: [
                ["raw-html", () => "Sacrifice your views here to gain sacrifice points to boost progression!"],
            ],
        },
    },
});
addLayer("prestige", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node.
    position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
    points: new Decimal(0),
    }},
    color: "#a130cf",
    requires: new Decimal(50000000),
    effect(){return player.prestige.points.add(1);},
    effectDescription(){return "boosting view gain by x" + format(this.effect());},
    resource: "prestige points", // Name of prestige currency
    baseResource: "subscribers", // Name of resource prestige is based on
    baseAmount() {return player.subcount.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.25, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
        return mult;
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1);
    },
    row: 1, // Row the layer is in on the tree
    branches: ["subcount", "money", "sacrifice"],
    hotkeys: [
        {key: "p", description: "p: Perform prestige", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return hasUpgrade("sacrifice", 13);},

    upgrades: {
        11: {
            title: "Start over with new knowledge!",
            description: "You reset your channel, but learned some things from your first channel, quadrupling view gain.",
            cost: new Decimal(1),
            effect() {
                return new Decimal(4);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        12: {
            title: "Improved Subscription Tactics",
            description: "Increase subscriber gain based on prestige points.",
            cost: new Decimal(5),
            unlocked() {return hasUpgrade("prestige", 11);},
            effect() {
                return player.prestige.points.div(1.5).add(1).pow(0.7);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
        13: {
            title: "Saving Strategy",
            description: "Divide the BASE cost of money based on prestige points, allowing it to go below 1000.",
            cost: new Decimal(20),
            unlocked() {return hasUpgrade("prestige", 12);},
            effect() {
                return player.prestige.points.div(2).add(1);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
        14: {
            title: "Prestigious Sacrifice",
            description: "Sacrifice gain increases based on prestige points.",
            cost: new Decimal(50),
            unlocked() {return hasUpgrade("prestige", 13);},
            effect() {
                return player.prestige.points.div(2).add(1).pow(0.5);
            },
            effectDisplay() { return "/" + format(this.effect()); },
        },
    },
    milestones: {
        0: {
            requirementDescription: "1000 Money",
            effectDescription: "Making Those Bucks!",
            done() { return player.prestige.points.gte(1000); },
        },
    },

    tabFormat: {
        "Main Tab": {
            content: [
                "main-display",
                "prestige-button",
                "resource-display",
                "upgrades",
                "milestones",
            ],
        },
        "About": {
            content: [
                ["raw-html", () => "Prestige points will drastically boost metrics but come at a large cost of resetting everything before it."],
            ],
        },
    },
});
