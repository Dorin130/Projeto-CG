'use strict'
function straightLine(spacing, start, end, includeLast) {
	var doLast = includeLast || true;
	var direction = end.clone().sub(start);
	var distance = direction.length();
	var noPos = Math.floor(distance/spacing);
	spacing = distance/noPos || 0;
	var dirIncrement = direction.normalize().multiplyScalar(spacing);

	var posList = [];
	for(var i = 0; i<noPos; i++) {
		posList.push(start.clone().addScaledVector(dirIncrement, i));
	}
	if(includeLast) {
		posList.push(end.clone());
	}
	return posList;
}

function curvedLine(spacing, start, end, up, offset, includeLast) {
	var direction = end.clone().sub(start);
	var side = up.clone().cross(direction).normalize();
	side.multiplyScalar(offset);
	var center = side.addScaledVector(direction, 1/2);
	var r_start = start.clone().sub(center);
	var total_angle = r_start.angleTo(end.clone().sub(center));
	var angleSpacing = 2*Math.asin(spacing/(2*r_start.length()))
	var noPos = Math.floor(total_angle/angleSpacing);
	console.log(noPos);
	var angleSpacing = (total_angle/noPos) || 0;

	var posList = [];
	posList.push(start);
	for(var i = 1; i<noPos; i++) {
		posList.push(center.clone().add(r_start.applyAxisAngle(up, angleSpacing)));
	}
	if(includeLast) {
		posList.push(end);
	}
	return posList;
}

function fillPos(posList, cheerio) {
	console.log(posList.length);
	var length = posList.length;
	for(var i=0; i<length; i++) {
		var newCheerio = cheerio();
		var geometry = new THREE.TorusGeometry( 3, 1, 10, 8 );
		var material = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
		var torus = new THREE.Mesh( geometry, material );
		torus.rotation.x = Math.PI/2;
		var pos = posList.pop();

		newCheerio.setPosition(pos.x, pos.y, pos.z);
		scene.add(torus);
	}
	return 1;
}

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

function getCollisionsWithOthers() {}  //DORIN