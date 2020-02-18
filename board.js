/**
 * Class Board
 * param width number of columns 
 * param height number of rows
 * param createTile Tile factory
 * 
 */
function Board(width, height, creatTile) {
	this.width = width;
	this.height = height;
	this.columns = [];
	for (var x = 0; x < width; x++) {
		var column = [];
		for (var y = 0; y < height; y++) {
			column.push(creatTile());
		}
		this.columns.push(column);
	}
	this.battle = false;
}


// Random empty Tile
Board.prototype.getEmptyTile = function () {
		while (true) {
			var x = Math.floor(Math.random() * this.width);
			var y = Math.floor(Math.random() * this.height);
			var tile = this.getTile(x, y);
			if (!tile.isEmpty()) {
				continue;
			}
			return tile;
		}
	}
	// Tile at position
Board.prototype.getTile = function (x, y) {
	if (x < 0 || x >= this.width) {
		return null;
	}
	if (y < 0 || y >= this.height) {
		return null;
	}
	return this.columns[x][y];
}
Board.prototype.getWidth = function () {
	return this.width;
}
Board.prototype.getHeight = function () {
	return this.height;
}
Board.prototype.movePlayer = function (fromX, fromY, toX, toY) {
	if (this.battle) {
		return;
	}
	var from = this.getTile(fromX, fromY);
	if (!from.player) {
		return false;
	}
	var to = this.getTile(toX, toY);
	if (to.player || to.muted) {
		return false;
	}
	var player = from.player;
	var moved = false;
	if (fromX === toX) {
		var direction = toY - fromY
		var offset = direction > 0 ? 1 : -1;
		var distance = Math.abs(direction);
		if (distance > 0 && distance <= 3) {
			var currentY = fromY;
			for (var i = 0; i < distance; i++) {
				currentY += offset;
				var tile = this.getTile(fromX, currentY);
				if (tile.muted) {
					return false;
				}
			}
			currentY = fromY;
			for (var i = 0; i < distance; i++) {
				currentY += offset;
				var tile = this.getTile(fromX, currentY);
				if (tile.weapon) {
					var weapon = tile.weapon;
					tile.weapon = player.weapon;
					player.weapon = weapon;
				}
				if (this.shouldBattleBegin(fromX, currentY, player)) {
					to = tile;
					this.battle = true;
					break;
				}
			}
			moved = true;
		}
	}
	else if (fromY === toY) {
		var direction = toX - fromX
		var offset = direction > 0 ? 1 : -1;
		var distance = Math.abs(direction);
		if (distance > 0 && distance <= 3) {
			var currentX = fromX;
			for (var i = 0; i < distance; i++) {
				currentX += offset;
				var tile = this.getTile(currentX, fromY);
				if (tile.muted) {
					return false;
				}
			}
			currentX = fromX;
			for (var i = 0; i < distance; i++) {
				currentX += offset;
				var tile = this.getTile(currentX, fromY);
				if (tile.weapon) {
					var weapon = tile.weapon;
					tile.weapon = player.weapon;
					player.weapon = weapon;
				}
				if (this.shouldBattleBegin(currentX, fromY, player)) {
					to = tile;
					this.battle = true;
					break;
				}
			}
			moved = true;
		}
	}
	if (moved) {
		to.setPlayer(from.getPlayer());
		from.setPlayer(null);
		this.player1.active = true;
		this.player2.active = true;
		player.active = false;
	}
	return moved;
}

Board.prototype.setPlayers = function(player1, player2) {
	this.player1 = player1;
	this.player2 = player2;
}

Board.prototype.shouldBattleBegin = function (x, y, player) {
	return this.hasPlayer(x + 1, y, player) || this.hasPlayer(x - 1, y, player) || this.hasPlayer(x, y + 1, player) || this.hasPlayer(x, y - 1, player);
}
Board.prototype.hasPlayer = function (x, y, player) {
		var tile = this.getTile(x, y);
		if (tile && tile.player && tile.player !== player) {
			return true;
		}
		return false;
	}
Board.prototype.attack = function(type){
	if(!this.battle){
		return;
	}
	if(this.player1.type === type){
		this.player1.attack(this.player2);
	}else if(this.player2.type === type){
		this.player2.attack(this.player1);
	}
}

Board.prototype.defend = function(type){
	if(!this.battle){
		return;
	}
	if(this.player1.type === type){
		this.player1.defending = true;
		this.player1.active = false;
		this.player2.active = true;
	}else if(this.player2.type === type){
		this.player2.defending = true;
		this.player2.active = false;
		this.player1.active = true;
	}
}