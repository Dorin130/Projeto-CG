'use strict'
class cheerio {
	constructor(radius, tubeRadius, radialSegments, tubularSegments, mass) {
		//movement
		this.mass = 10
		this.speed = new THREE.Vector3(0,0,0);

		//collisions
		this.boundingRadius = radius;
		this.final = false;
		this.tentativePos;
		this.incomingList[];	//(position from, boundingRadius, speed vector, mass) 


		//mesh
		this.geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		this.material = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
		var cheerioMesh = new THREE.Mesh( geometry, material );
		cheerioMesh.rotation.x = Math.PI/2;
		this.cheerioObj = new THREE.Object3D().add(cheerioMesh);

	}

	update(delta_t) { //after first and second tentatives
		this.position = this.tentativePos;
	}


	firstTentative(delta_t) { //before any collision detection
		applyAttrition(); 
		this.tentativePos = this.cheerioObj.position.clone().addScaledVector(this.speed, delta_t);
	}

	secondTentative(delta_t) { //after every cheerio has had firstTentative calculated
		this.resolveClipping();
		this.computePreSpeed();
		physicsResponses = this.applyCollisionsToOthers();
		this.computeAfterSpeed(physicsResponses);
		this.isFinal = true;
	}

	resolveClipping() { //also 
		collsNo = incomingList.length;
		for(i=0; i<collsNo; i++) {
			//var unclipDir = TO DO
		}
	}

	computePreSpeed() { computeAfterSpeed(this.incomingList); } //unchecked if correct

	computeAfterSpeed(physicsInteractions) {
		//this.speed = awesome equations thing
	}

	applyCollisionsToOthers() {
		collsList = getCollisionsWithOthers();
		len = collsList.length
		physicsResponses = []
		for(var i = 0; i<len; i++) {
			if(!collsList[i].isFinal()) {
				physicsResponses.push(collsList[i].incomingCollision(this.tentativePos, this.boundingRadius, this.speed, this.mass, false));
			}
		}
		return physicsResponses;
	}

	incomingCollision(fromPos, boundingRadius, speed, mass, isCar) {
		if(isCar) {
			incomingList.unshift([fromPos, boundingRadius, speed, mass, false]);
		} else {
			incomingList.push([fromPos, boundingRadius, speed, mass, false]);
		}
		return [this.tentativePos, this.boundingRadius, this.speed, this.mass, false];
	}

	applyAttrition() {}

	isFinal() {
		return this.final;
	}

	setPosition(PosX, PosY, PosZ) {
		this.cheerioObj.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.cheerioObj.rotation.set(RotX, RotY, RotZ);
	}

}

function getCollisionsWithOthers() {}  //DORIN i can explain this later if need be