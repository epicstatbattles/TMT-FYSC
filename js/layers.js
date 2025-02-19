addLayer("subcount", {
    name: "subcount", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
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
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
		if (hasUpgrade("subcount", 21)) mult = mult.times(upgradeEffect("subcount", 21));
		if (hasUpgrade("subcount", 24)) mult = mult.times(upgradeEffect("subcount", 24));
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
                return player.subcount.points.add(1).pow(0.25);
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
                return player.points.add(1).pow(0.2).div(10);
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
				return subtime.div(100).add(1).pow(0.35);
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
				return subtime.div(200).add(1).pow(0.325);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
		22: {
            title: "The grind begins!",
            description: "You become dedicated to making videos and a few shorts. Boost view gain based on total subs gained.",
            cost: new Decimal(20),
			unlocked() {return hasUpgrade("subcount", 21);},
            effect() {
				return player.subcount.total.div(5).add(1).pow(0.2);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
		23: {
            title: "Going for monetization!",
            description: "You decide you want to be monetized. Your best sub amount boosts view gain further.",
            cost: new Decimal(50),
			unlocked() {return hasUpgrade("subcount", 22);},
            effect() {
				return player.subcount.best.div(4.5).add(1).pow(0.2125);
            },
            effectDisplay() { return "x" + format(this.effect()); },
        },
		24: {
            title: "Retention Techniques!",
            description: "You not only gain views, but keep your viewers locked in. Slightly boost sub gain based on their amount.",
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
