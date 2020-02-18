//class Renderer
function Renderer(board, boyplayer, girlplayer) {
	this.board = board;
	this.boyplayer = boyplayer;
	this.girlplayer = girlplayer;
	this.battle = false;
};
Renderer.prototype.render = function () {
	var height = this.board.getHeight();
	var width = this.board.getWidth();
	var tableBoard = $('#board');
	tableBoard.empty();

	var self = this
	for (var y = 0; y < height; y++) {
		var row = $("<tr></tr>");
		for (var x = 0; x < width; x++) {
			var $tile = $("<td></td>");
			$tile.data("x", x);
			$tile.data("y", y);
			var tile = this.board.getTile(x, y);
			if (tile.muted) {
				$tile.addClass("bg-muted")
			}
			if (tile.player) {
				$tile.addClass("player")
				if (tile.player.active) {
					$tile.attr("draggable", "true");
					
				}
				$tile.addClass(tile.player.name);
				
			}
			if (tile.weapon) {
				$tile.addClass(tile.weapon.name);
				
			}
			$tile.on("dragstart", function (event) {
				var $target = $(event.currentTarget);
				event.originalEvent.dataTransfer.setData("tile", JSON.stringify({
					x: $target.data("x")
					, y: $target.data("y")
				}))		
			});
			$tile.on("drop", function (event) {
				var $target = $(event.currentTarget);
				var origin = JSON.parse(event.originalEvent.dataTransfer.getData("tile"));
				if (self.board.movePlayer(origin.x, origin.y, $target.data("x"), $target.data("y"))) {
					self.render();
					
					
				}
			});
			$tile.on("dragover", function (event) {
				event.preventDefault();
			});
			row.append($tile);
			
		}
		tableBoard.append(row);
		
	}
	if (!this.battle){
		if (this.board.battle){
			this.battle = true;
			$("#infor").css("display","block");
			$("#infor").delay(3000).fadeOut("slow");
		}
	}
	this.updatePlayerInfo("#playerOne", this.boyplayer);
                   
	this.updatePlayerInfo("#playerTwo", this.girlplayer);
}

//update player
Renderer.prototype.updatePlayerInfo = function (id, player) {
	$(id).each(function () {
		var $elem = $(this);
		var description = player.description + " : " + player.health + "%health";
		if (player.weapon) {
			description += " has " + player.weapon.description;
		}
		$elem.html(description);
		if (player.active) {
			$elem.addClass("text-success");
			
		}
		else {
			$elem.removeClass("text-success");
		
		}
	});
	if (player.health === 0) {
		
		$("#gameover").css("display","block");
		$("#gameover").append( "<span> <b> Game Over </b> </span>" + player.description + "<span><b>   has Lost the game</b> </span>");
	}
}
	//class Player
function Player(type, health, name, description, active) {
	this.type = type;
	this.health = health;
	this.name = name;
	this.description = description;
	this.active = active;
}

Player.prototype.attack = function(defender){
	if(!this.active){
		return;
	}
	var damage = 10;
	if(this.weapon){
		damage += this.weapon.damage;
	}
	if(defender.defending){
		damage /= 2;
	}
	defender.health -= damage;
	if(defender.health < 0){
		defender.health = 0;
	}
	defender.defending = false; 
	this.active = false;
	defender.active = true;
}

//class Weapon
function Weapon(type, name, description, damage) {
	this.type = type;
	this.name = name;
	this.description = description;
	this.damage = damage;
}

	
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

/**
 * Class Board
 * param width number of columns 
 * param height number of rows
 * param createTile Tile factory
 * 
 */
function Board(width, height, createTile) {
	this.width = width;
	this.height = height;
	this.columns = [];
	for (var x = 0; x < width; x++) {
		var column = [];
		for (var y = 0; y < height; y++) {
			column.push(createTile());
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


// Get the modal
var modal = document.getElementById("Modal");

// Get the button that opens the modal
var btn = document.getElementById("Btnmodal");

// Get the <span> element that closes the modal
var span = document.getElementById("content1");

// When the user clicks the button, open the modal 
Btnmodal.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
  
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
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
		this.boyplayer.active = true;
		this.girlplayer.active = true;
		player.active = false;
	}
	return moved;
}

Board.prototype.setPlayers = function(boyplayer, girlplayer) {
	this.boyplayer = boyplayer;
	this.girlplayer = girlplayer;
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
	if(this.boyplayer.type === type){
		this.boyplayer.attack(this.girlplayer);
	}else if(this.girlplayer.type === type){
		this.girlplayer.attack(this.boyplayer);
	}
}

Board.prototype.defend = function(type){
	if(!this.battle){
		return;
	}
	if(this.boyplayer.type === type){
		this.boyplayer.defending = true;
		this.boyplayer.active = false;
		this.girlplayer.active = true;
	}else if(this.girlplayer.type === type){
		this.girlplayer.defending = true;
		this.girlplayer.active = false;
		this.boyplayer.active = true;
	}
}

//Starting Game
function startGame() {
	$(".playersInfo").css("display", "none");
	$(".game").css("display", "block");
	var mutedTiles = 10;
	var playerOneName =$("#boyplayer").val();
	var playerTwoName = $("#girlplayer").val();
	
	
	var board = new Board(10, 10, function () {
		return new Tile(false);
		
	});
	
	for (var i = 0; i < mutedTiles; i++) {
		var tile = board.getEmptyTile();
		tile.setMuted(true);
	}
	var boyplayer = new Player(1, 100, "boyplayer", playerOneName, true);
	board.getEmptyTile().setPlayer(boyplayer);
	var girlplayer = new Player(2, 100, "girlplayer", playerTwoName, false);
	board.getEmptyTile().setPlayer(girlplayer);
	board.setPlayers(boyplayer, girlplayer);
	
	
	//Weapons
	board.getEmptyTile().setWeapon(new Weapon(1, "axe", "axe: 15 Points", 15));
	board.getEmptyTile().setWeapon(new Weapon(2, "bat", "bat: 30 Points", 30));
	board.getEmptyTile().setWeapon(new Weapon(3, "shield", "shield: 35 Points", 35));
	board.getEmptyTile().setWeapon(new Weapon(4, "whip", "whip: 20 Points", 20));
	var renderer = new Renderer(board, boyplayer, girlplayer);
	
	window.attack = function(type){
		board.attack(type);
		renderer.render();
	} 
	window.defend = function(type){
		board.defend(type);
		renderer.render();
	} 
	renderer.render();
}