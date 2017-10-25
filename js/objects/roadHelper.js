'use strict'

var TorusRadiusDEFAULT = 5;
var TorusTubeRadiusDEFAULT = 3;
var RadialSegmentsDEFAULT = 32;
var TubularSegmentsDEFAULT = 16;
var MassDEFAULT = 10;

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

function fillPos(posList) {
	var length = posList.length;
	cheerioList = [];
	for(var i=0; i<length; i++) {
		var newCheerio = new cheerio(TorusRadiusDEFAULT, TorusTubeRadiusDEFAULT, RadialSegmentsDEFAULT, TubularSegmentsDEFAULT, MassDEFAULT);
		var pos = posList.pop();
		newCheerio.setPosition(pos.x, pos.y, pos.z);
		cheerioList.push(newCheerio);
		scene.add(newCheerio.getObject());
	}
	return cheerioList;
}