'use strict'
class cheerio {
	constructor(radius, tubeRadius, radialSegments, tubularSegments, mass) {
		//movement
		this.speed = new THREE.Vector3(0,0,0);
		this.speedStopThreshold = 3;

		//collisions
		this.boundingRadius = radius;
		this.final = false;
		this.tentativePos;
		this.incomingList = [];	//(position from, boundingRadius, speed vector, mass) 


		//mesh
		this.geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		this.material = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
		var cheerioMesh = new THREE.Mesh( geometry, material );
		cheerioMesh.rotation.x = Math.PI/2;
		this.cheerioObj = new THREE.Object3D().add(cheerioMesh);

	}

	update(delta_t) { //after first tentative and collision handling
		this.collisionHandling(delta_t);
		this.position = this.tentativePos;
		this.final = false;
	}


	firstTentative(delta_t) { //before any collision detection
		applyAttrition(); 
		this.tentativePos = this.cheerioObj.position.clone().addScaledVector(this.speed, delta_t);
	}

	collisionHandling(delta_t) { //after every cheerio has had firstTentative calculated
		this.resolveClipping();
		//this.computePreSpeed();
		//physicsResponses = this.applyCollisionsToOthers();
		//this.computeSpeed();
		//this.isFinal = true;
	}

	resolveClipping() { //also 
		collsNo = incomingList.length;
		var unclipDir = new THREE.Vector3(0,0,0);
		for(i=0; i<collsNo; i++) {
			if(incomingList[4] == true) {
				var fromDir = this.tentativePos.clone().sub(incomingList[i][0]);
				distance = fromDir.length();
				unclipDir.add(fromDir.normalize().multiplyScalar(this.boundingRadius+incomingList[i][1]-distance));
			}
		}
		this.tentativePos.add(unclipDir);
	}

	//computePreSpeed() { computeAfterSpeed(this.incomingList); } //unchecked if correct

	computeSpeed() {
		console.log("very fast");
		this.speed = new THREE.Vector3(0,0,0);
		//this.speed = awesome equations thing
	}

	/*applyCollisionsToOthers() {
		collsList = getCollisionsWithOthers();
		len = collsList.length
		physicsResponses = []
		for(var i = 0; i<len; i++) {
			if(!collsList[i].isFinal()) {
				physicsResponses.push(collsList[i].incomingCollision(this.tentativePos, this.boundingRadius, this.speed, this.mass, false));
			}
		}
		return physicsResponses;
	}*/

	incomingCollision(singleCollision) { //[fromPos, boundingRadius, speed, mass]
		if(isCar) {
			incomingList.unshift(singleCollision);
		} else {
			incomingList.push(singleCollision);
		}
	}

	getCollisionResponse(youClip) {
		return [this.tentativePos, this.boundingRadius, this.speed, this.mass, youClip];
	}

	applyAttrition() {
		if (this.speed.length() < this.speedStopThreshold) {
			this.speed.multiplyScalar(0);
		} else {
			this.speed.multiplyScalar(1/3);
		}
	}

	/*
	isFinal() {
		return this.final;
	}
	*/

	setPosition(PosX, PosY, PosZ) {
		this.cheerioObj.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.cheerioObj.rotation.set(RotX, RotY, RotZ);
	}

}

function getCollisionsWithOthers() {}  //DORIN i can explain this later if need be