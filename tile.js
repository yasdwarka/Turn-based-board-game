	//Class Tile
function Tile(muted) {
	this.muted = muted;
}
// if tile is empty
Tile.prototype.isEmpty = function () {
		return !this.muted && !this.player && !this.weapon;
	}
	//muted
Tile.prototype.setMuted = function (value) {
	this.muted = value;
}
Tile.prototype.setPlayer = function (value) {
	this.player = value;
}
Tile.prototype.getPlayer = function () {
	return this.player;
}

Tile.prototype.setWeapon = function (value) {
		this.weapon = value;
	}