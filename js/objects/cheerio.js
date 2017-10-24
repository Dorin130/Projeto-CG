'use strict'
class cheerio {
	constructor(radius, tubeRadius, radialSegments, tubularSegments, mass) {
		//movement
		this.speed = new THREE.Vector3(0,0,0);
		this.speedStopThreshold = 3;

		//collisions
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
		this.collisionHandling(delta_t);
		this.setPosition(this.tentativePos.x, this.tentativePos.y, this.tentativePos.z);
		this.incomingList = [];
		this.final = false;
	}


	firstTentative(delta_t) { //before any collision detection
		this.applyAttrition(); 
		this.tentativePos = this.cheerioObj.position.clone().addScaledVector(this.speed, delta_t);
	}

	collisionHandling(delta_t) { //after every cheerio has had firstTentative calculated
		this.resolveClipping();
		//this.computeSpeed();
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
		console.log("very fast");
		this.speed = new THREE.Vector3(0,0,0);
		//this.speed = awesome equations thing
	}

	incomingCollision(singleCollision) { //[fromPos, boundingRadius, speed, mass]
		this.incomingList.push(singleCollision);
	}

	getCollisionResponse(dontUnclip) {
		return [this.tentativePos.clone(), this.boundingRadius, this.speed.clone(), this.mass, dontUnclip];
	}

	applyAttrition() {
		if (this.speed.length() < this.speedStopThreshold) {
			this.speed.multiplyScalar(0);
		} else {
			this.speed.multiplyScalar(1/3);
		}
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

function getCollisionsWithOthers() {}  //DORIN i can explain this later if need be