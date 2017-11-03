class baseObject extends THREE.Object3D {
	constructor(position) {
		super();
		this.position.copy(position);
		this.initialPosition = position.clone() || this.position.clone();
		this.initialRotation = this.rotation.clone();
	}

	update(delta_time) {}

	input(action) {}

	reset() {
		this.resetPosAndRot();
		/* Specific code above */

		this.propagateReset();
	}

	resetPosAndRot() {
		this.position.copy(this.initialPosition);
		this.rotation.copy(this.initialRotation);
	}

	propagateReset() {
		for(var i=0; i<this.children.length; i++) {
			if(this.children[i].reset != undefined)
				this.children[i].reset();
		}
	}

	toggleMesh() {

		/* Specific code above */

		this.propagateToggleMesh();
	}

	propagateToggleMesh() {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].toggleMesh();
		}
	}
}

DEFAULT_BOUNDING_RADIUS = 1;

class collidableObject extends baseObject {
	constructor(position, boundingRadius, boundingOffset) {
		super(position);
		this.boundingRadius = boundingRadius || DEFAULT_BOUNDING_RADIUS;
		this.boundingOffset = boundingOffset || new THREE.Vector3(0,0,0);
		this.isCollidableObject = true;
	}

	getTentativePosition() {
		return this.position.clone();
	}

	getBoundingCenter() { //must have for hasCollision
		return this.getTentativePosition().add(boundingOffset);
	}

	getBoundingRadius() { //must have for hasCollision
		return this.boundingRadius;
	}
}

DEFAULT_STOP_THRESHOLD = 5;
DEFAULT_FRICTION_COEFFICIENT = 10;

class movingObject extends collidableObject {
	constructor(position, boundingRadius, speedStopThreshold, frictionCoefficient, speed, acceleration) {
		super(position, boundingRadius);
		this.speedStopThreshold = speedStopThreshold || DEFAULT_STOP_THRESHOLD;
		this.frictionCoefficient = frictionCoefficient || DEFAULT_FRICTION_COEFFICIENT;
		this.speed = speed || new THREE.Vector3(0,0,0);
		this.acceleration = acceleration || new THREE.Vector3(0,0,0);
		this.isMovingObject = true;
	}

	setFriction(value) {
		this.frictionCoefficient = value;
	}

	setSpeedStopThreshold(value) {
		this.speedStopThreshold = value;
	}

	getAcceleration() {
		return this.acceleration.clone();
	}

	getSpeed() {
		return this.speed.clone();
	}

	setSpeed(v) {
		this.speed.copy(v);
	}

	getFriction() {
		return this.speed.clone().normalize().negate().multiplyScalar(this.frictionCoefficient);
	}

	update(delta_time) {
		this.speedUpdate(delta_time);
		this.positionUpdate(delta_time);
	}

	speedUpdate(delta_time) {
		var preFriction = this.speed.add(this.acceleration().clone().multiplyScalar(delta_time));
		var postFriction = this.speed.add(this.getFriction().multiplyScalar(delta_time));
		if(preFriction.dot(postFriction) <= 0 || postFriction.length() <= this.speedStopThreshold) {
			this.speed.set(0,0,0);
		}
	}

	positionUpdate() {
		this.position.add(this.speed.clone().multiplyScalar(delta_time));
	}
}

class physicalObject extends movingObject {
	constructor(position, boundingRadius, speedStopThreshold, frictionCoefficient) {
		super(position, boundingRadius, speedStopThreshold, frictionCoefficient, mass);
		this.mass = mass;
		this.tentativePos = this.position.clone();
		this.isPhysicalObject = true;
	}
	/*
	getCollisionResponse() {
		return [this.getBoundingCenter(), this.getBoundingRadius(), this.getSpeed(), this.mass];
	}
	*/
	resolveClipping(otherObject) {
		if(!otherObject.isCollidableObject) return;

		var unclipDir = this.getTentativePosition().sub(otherObject.getTentativePosition());
		unclipDir.setLength(this.getBoundingRadius()+otherObject.getBoundingRadius());
		this.tentativePos.add(unclipDir);
	}
}



'use strict'
class cheerio {
	constructor(radius, tubeRadius, radialSegments, tubularSegments, mass) {
		//movement
		this.speed = new THREE.Vector3(0,0,0);
		this.speedStopThreshold = 3;
		this.attritionValue = 100;

		//collisions
		this.mass = 1;
		this.boundingRadius = radius+tubeRadius;
		this.final = false;
		this.tentativePos;
		this.incomingList = [];	//(position from, boundingRadius, speed vector, mass) 

		//mesh
		this.geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		this.material = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
		var cheerioMesh = new THREE.Mesh( this.geometry, this.material );
		cheerioMesh.rotation.x = Math.PI/2;
		this.cheerioObj = new THREE.Object3D().add(cheerioMesh);

	}

	update(delta_t) { //after first tentative and collision handling
		this.setPosition(this.tentativePos.x, this.tentativePos.y, this.tentativePos.z);
		this.final = false;
	}


	firstTentative(delta_t) { //before any collision detection
		this.applyAttrition(delta_t); 
		this.tentativePos = this.cheerioObj.position.clone().addScaledVector(this.speed, delta_t);
		//console.log(this.tentativePos);
	}

	collisionHandling() { //after every cheerio has had firstTentative calculated
		this.resolveClipping();
		this.computeSpeed();
		this.incomingList = [];
	}

	resolveClipping() { //also 
		var collsNo = this.incomingList.length;
		var unclipDir = new THREE.Vector3(0,0,0);
		for(var i=0; i<collsNo; i++) {
			if(this.incomingList[i][4] == false) {
				var fromDir = this.tentativePos.clone().sub(this.incomingList[i][0]);
				var distance = fromDir.length();
				unclipDir.add(fromDir.normalize().multiplyScalar(this.boundingRadius+this.incomingList[i][1]-distance));
			}
		}
		this.tentativePos.add(unclipDir);
	}

	computeSpeed() {
		var collsNo = this.incomingList.length;
		for(var i=0; i<collsNo; i++) {
			var m2 = this.incomingList[i][3];
			var v2 = this.incomingList[i][2];
			var fromDir = this.tentativePos.clone().sub(this.incomingList[i][0]);
			var distanceSquared = this.tentativePos.distanceToSquared(this.incomingList[i][0]);
			var factor = (2*m2/(this.mass+m2))*((this.speed.clone().sub(v2)).dot(fromDir)/(distanceSquared));
			this.speed.sub(fromDir.multiplyScalar(factor));
		}
	}

	incomingCollision(singleCollision) { //[fromPos, boundingRadius, speed, mass]
		this.incomingList.push(singleCollision);
		this.collisionHandling();
	}

	getCollisionResponse(dontUnclip) {
		return [this.tentativePos.clone(), this.boundingRadius, this.speed.clone(), this.mass, dontUnclip];
	}

	applyAttrition(delta_t) {
		if (this.speed.length() < this.speedStopThreshold) {
			this.speed.multiplyScalar(0);
		} else {
			this.speed.sub(this.speed.clone().normalize().multiplyScalar(this.attritionValue*delta_t));
		}
		//console.log(this.speed);
	}

	isFinal() {
		return this.final;
	}

	setFinal() {
		this.final = true;
	}

	setPosition(PosX, PosY, PosZ) {
		this.cheerioObj.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.cheerioObj.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.cheerioObj;
	}

	getTentativePosition() {
		return this.tentativePos;
	}

}
