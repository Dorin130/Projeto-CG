var DEFAULT_SPEED = 40
var SPACING = 5
var SPEED_FACTOR = 1


class randomizableObject {
	constructor() {
		this.randomizerInputs = new THREE.Vector3(0,0,0); //use this to get info
		this.rotationAxis = new THREE.Vector3(0,0,0);
		this.currentSpeed = DEFAULT_SPEED;
	}
	randomizerUpdater(delta_t) {
		//IMPLEMENT THIS METHOD IN THE SUBCLASSES
	}
}

class path {
	constructor(object, path, randomizer) {
		this.object = object;
		this.path = path;
		this.randomizer = randomizer
	}

	notifyRandomizer() {
		this.randomizer.notifications.push(this);
	}

	update(delta_t, speed, limitx, limitY, limitZ) {
		this.object.getPosition().x
		if( this.object.getPosition().x  <= limitx + SPACING  && this.object.getPosition().z <= limitZ + SPACING && 
			this.object.getPosition().x  >= -(limitx + SPACING) && this.object.getPosition().z  >= -(limitZ + SPACING)) {
			this.object.currentSpeed = speed;
			
			this.object.randomizerInputs.set(this.path.x*speed*delta_t, this.path.y*speed*delta_t, this.path.z*speed*delta_t);
			this.object.update(delta_t);
		}
		else {
			this.notifyRandomizer(); //Notifies the randomizer that an object is out of bounds
		}		
	}
}

class randomizer {
	constructor(limitX, limitY, limitZ, speed) {
		this.limitX = limitX;
		this.limitY = limitY;
		this.limitZ = limitZ;

		this.speed = speed || DEFAULT_SPEED; 
		this.notifications = []
		this.paths = [];
	}

	random(min, max) {
		return Math.random() * (max - min) + min;
	}

	createOranges(minOranges, maxOranges, radius) {
		for(var i=0; i < this.random(minOranges, maxOranges); i++) {

			var object = new orange(this.random(-this.limitX, this.limitX), this.limitY, 
								this.random(-this.limitZ, this.limitZ), radius);
			var direction = new THREE.Vector3(this.random(-1,1), 0, this.random(-1,1)).normalize();
			var objPath = new path(object, direction ,this);

			object.rotationAxis = direction.clone().cross(new THREE.Vector3(0,1,0));
			
			this.paths.push(objPath);
		}
		console.log(this.paths);
	}

	createButters(minButters, maxButters, width, height, depth) {
		for(var i=0; i < this.random(minButters, maxButters); i++) {

			var object = new butter(this.random(-this.limitX, this.limitX), this.limitY, 
								this.random(-this.limitZ, this.limitZ), width, height, depth);
			var objPath = new path(object, new THREE.Vector3(0,0,0), this);

			this.paths.push(path);
		}
	}

	replyToNotifications() {
		while(this.notifications.length > 0) {
			var path = this.notifications.pop();

			var positionsFixed = Math.floor(this.random(0,2));
			var posX = 0 
			var posZ = 0;
			var pos = [];
			if(positionsFixed == 0) {
				pos = [-this.limitX, this.limitX];
				posX = pos[Math.floor(this.random(0,2))];
				posZ = this.random(-this.limitZ, this.limitZ);

				path.path = new THREE.Vector3(-Math.sign(posX)*this.random(0, 1), 0, this.random(-1,1)).normalize();

			}
			else {
				pos = [-this.limitZ, this.limitZ];
				posZ = pos[Math.floor(this.random(0,2))];
				posX = this.random(-this.limitX, this.limitX);
				path.path = new THREE.Vector3(this.random(-1,1), 0, -Math.sign(posZ)*this.random(0,1)).normalize();
			}
			path.object.setRotation(0,0,0);
			path.object.rotationAxis = path.path.clone().cross(new THREE.Vector3(0,1,0));
			path.object.setPosition(posX, this.limitY, posZ);

		}
	}

	changeSpeed(newSpeed) {
		this.speed = newSpeed;
	}

	update(delta_t) {
		for(var i=0; i < this.paths.length; i++ ) {
			this.replyToNotifications();
			this.changeSpeed(this.speed + SPEED_FACTOR/this.speed);
			this.paths[i].update(delta_t, this.speed, this.limitX, this.limitY, this.limitZ);
		}
	}
}