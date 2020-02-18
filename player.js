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
	var damage = 5;
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
