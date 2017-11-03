'use strict'
class baseObject extends THREE.Object3D {
	constructor(position) {
		super();
		var pos = position || new THREE.Vector3(0,0,0);
		this.position.copy(pos);
		this.initialPosition = this.position.clone();
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

var DEFAULT_BOUNDING_RADIUS = 1;

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
		return this.getTentativePosition().add(this.boundingOffset);
	}

	getBoundingRadius() { //must have for hasCollision
		return this.boundingRadius;
	}
}

var DEFAULT_STOP_THRESHOLD = 5;
var DEFAULT_FRICTION_COEFFICIENT = 100;

class movingObject extends collidableObject {
	constructor(position, boundingRadius, speedStopThreshold, frictionCoefficient, speed, acceleration) {
		super(position, boundingRadius);
		this.speedStopThreshold = speedStopThreshold || DEFAULT_STOP_THRESHOLD;
		this.frictionCoefficient = frictionCoefficient || DEFAULT_FRICTION_COEFFICIENT;
		this.speed = speed || new THREE.Vector3(0,0,0);
		this.acceleration = acceleration || new THREE.Vector3(0,0,0);
		this.tentativePos = this.position.clone();
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

	getFriction() {
		return this.speed.clone().normalize().negate().multiplyScalar(this.frictionCoefficient);
	}

	update(delta_time) {
		this.position.copy(this.getTentativePosition());
		this.speedUpdate(delta_time);
		this.tentativePos.add(this.speed.clone().multiplyScalar(delta_time));
	}

	getTentativePosition() {
		return this.tentativePos.clone();
	}

	speedUpdate(delta_time) {
		var preFriction = this.speed.add(this.acceleration.clone().multiplyScalar(delta_time));
		var postFriction = this.speed.add(this.getFriction().multiplyScalar(delta_time));
		if(preFriction.dot(postFriction) <= 0 || postFriction.length() <= this.speedStopThreshold) {
			this.speed.set(0,0,0);
		}
	}
}

class physicalObject extends movingObject {
	constructor(position, boundingRadius, speedStopThreshold, frictionCoefficient, mass) {
		super(position, boundingRadius, speedStopThreshold, frictionCoefficient);
		this.mass = mass;
		this.tentativeSpeed = this.speed.clone();
		this.isPhysicalObject = true;
	}

	handleCollision(otherObject, clip) {
		if(!clip) this.resolveClipping(otherObject);
		this.receiveKineticEnergy(otherObject);
	}

	resolveClipping(otherObject) {
		//if(!otherObject.isCollidableObject) return;

		var unclipDir = this.getTentativePosition().sub(otherObject.getTentativePosition());
		unclipDir.setLength(this.getBoundingRadius()+otherObject.getBoundingRadius()-unclipDir.length()+0.1);
		this.tentativePos.add(unclipDir);
	}

	/*
						2 * m2       (v1-v2) . (x1-x2)						m: mass
		v1'	=  v1  -  ----------- * -------------------- * (x1-x2)			v: speed
					    m1 + m2		   ||x1 - x2||^2						x: position
	*/
	receiveKineticEnergy(otherObject) {
		var m1 = this.mass; var m2 = otherObject.mass;
		var v1 = this.getSpeed(); var v2 = otherObject.getSpeed();
		var x1 = this.getTentativePosition(); var x2 = otherObject.getTentativePosition();
		var factor = (2*m2/(m1+m2))*(v1.sub(v2)).dot(x1.clone().sub(x2))/(x1.distanceToSquared(x2));
		this.tentativeSpeed.sub((x1.sub(x2)).multiplyScalar(factor));
	}

	speedUpdate(delta_time) {
		this.speed.copy(this.tentativeSpeed);
		var preFriction = this.speed.add(this.acceleration.clone().multiplyScalar(delta_time));
		var postFriction = this.speed.add(this.getFriction().multiplyScalar(delta_time));
		if(preFriction.dot(postFriction) <= 0 || postFriction.length() <= this.speedStopThreshold) {
			this.speed.set(0,0,0);
		}
		this.tentativeSpeed.copy(this.speed);
	}
}