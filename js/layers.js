addLayer("subcount", {
    name: "subcount", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
	points: new Decimal(0),
    }},
    color: "#ff0000",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "subscribers", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1);
		if (hasUpgrade("subcount", 21)) mult = mult.times(upgradeEffect("subcount", 21));
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
                let subtime=new Decimal(player.subcount.resetTime)
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
                let subtime=new Decimal(player.subcount.resetTime)
				return subtime.div(200).add(1).pow(0.325);
            },
            effectDisplay() { return "x" + format(this.effect()); },
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
                ["raw-html", () => "The meme has entered galactic levels of fame!"],
        	],
    	},
    },
});
