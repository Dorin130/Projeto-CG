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
	constructor(radius, tubeRadius, radialSegments, tubularSegments) {
		//movement
		this.direction = new THREE.Vector3(0,0,0);
		this.

		//mesh
		this.geometry = new THREE.TorusGeometry(radius, tubeRadius, radialSegments, tubularSegments);
		this.material = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
		this.cheerioMesh = new THREE.Mesh( geometry, material );
		this.cheerioMesh.rotation.x = Math.PI/2;
	}

	getClone() {
		return new cheerio(this.radius, this.tubeRadius, this.radialSegments, this.tubularSegments);
	}
}