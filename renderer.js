//class Renderer
function Renderer(board, player1, player2) {
	this.board = board;
	this.player1 = player1;
	this.player2 = player2;
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
	this.updatePlayerInfo("#playerOne", this.player1);
	this.updatePlayerInfo("#playerTwo", this.player2);
};
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
		$("#gameover").append( "<span>Game Over </span>" + player.description + " <span> Lost</span>");
	}
}