let modInfo = {
	name: "Faking Your Sub Counts",
	author: "Epic Stat Battles",
	pointsName: "views",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
	offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
	num: "0.1.2",
	name: "Faking Your Sub Counts",
}

let changelog = `<h1>Changelog:</h1><br>
	<h3>v0.1.2</h3><br>
		- Added 4 more monetization upgrades.<br>
	<h3>v0.1.1</h3><br>
		- Added 2 more monetization upgrades.<br>
		- Changed subscriber upgrade 4's formula to logarithmic and buffed overtime upgrade speeds.<br>
	<h3>v0.1</h3><br>
		- Added monetization and 2 upgrades for it.<br>
	<h3>v0.0.3</h3><br>
		- Added 4 more upgrades. (10 upgrades total now)<br>
	<h3>v0.0.2</h3><br>
		- Added 3 more upgrades.<br>
	<h3>v0.0.1</h3><br>
		- Added 2 more upgrades.<br>
	<h3>v0.0</h3><br>
		- Added subscribers.<br>
		- Added 1 upgrade.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
		return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
	return true
}

// Calculate points/sec!
function getPointGen() {
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(0);
	if (hasUpgrade("subcount", 11)) gain = gain.add(0.25);
	if (hasUpgrade("subcount", 13)) gain = gain.add(0.25);
	if (hasUpgrade("subcount", 14)) gain = gain.add(upgradeEffect("subcount", 14));
	if (hasUpgrade("subcount", 15)) gain = gain.times(upgradeEffect("subcount", 15));
	if (hasUpgrade("subcount", 12)) gain = gain.times(upgradeEffect("subcount", 12));
	if (hasUpgrade("subcount", 22)) gain = gain.times(upgradeEffect("subcount", 22));
	if (hasUpgrade("subcount", 23)) gain = gain.times(upgradeEffect("subcount", 23));
	if (hasUpgrade("money", 11)) gain = gain.times(upgradeEffect("money", 11));
	if (hasUpgrade("money", 12)) gain = gain.times(upgradeEffect("money", 12));
	if (hasUpgrade("money", 21)) gain = gain.times(upgradeEffect("money", 21));
	if (hasUpgrade("money", 23)) gain = gain.times(upgradeEffect("money", 23));
	if (hasMilestone("money", 0)) gain = gain.times(player.money.points.div(10).add(1));
	if (hasMilestone("subcount", 3)) gain = gain.times(2);
	gain = gain.times(player.sacrifice.points.add(1).pow(0.2));
	if (hasUpgrade("sacrifice", 12)) gain = gain.times(upgradeEffect("sacrifice", 12));
	if (hasUpgrade("prestige", 11)) gain = gain.times(upgradeEffect("prestige", 11));
	gain = gain.times(player.prestige.points.add(1));
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
