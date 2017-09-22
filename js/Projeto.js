/* GLOBAL THREE */
'use strict'

/* Global variables */
var scene, renderer, customCam;

var geometry, material, mesh;

var updateList = []; /* contains every object to be updated in the update cycle except customCamera*/

var clock = new THREE.Clock();
var totalTime = 0;

/* Event Listeners */
window.addEventListener( 'resize', onWindowResize, false );

/* INIT */
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	var focus = createScene();

	//customCam = new customCamera(createOrtographicCamera(200, 0, 40, 0), scene.position);
	
	var customCam2 = new customCamera(createPerspectiveCamera(0, 0, 0), scene.position);
	//customCam2.focusOn(updateList[0].getObject());
	//customCam2.follow(updateList[0].getObject());
	customCam2.setTransform(50, 0, Math.PI/8, Math.PI/4, Math.PI/2, 0);
	
	customCam = customCam2;

	render(customCam.getCamera());
	animate();
}

/* Event Listener Functions */
function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    customCam.updateWindowResize();
}

/* Animation main function and update/render cycle */
function animate() {
	//update objects
	requestAnimationFrame(animate);
	var delta_t = clock.getDelta();
	totalTime += delta_t;

	for(var i = 0; i<updateList.length; i++) { /* updates each individual object */
		if(updateList[i].update != undefined) { updateList[i].update(delta_t); }
	}

	customCam.update(delta_t);

	//render
	render(customCam.getCamera());
}

/* Camera related functions and classes */
class customCamera {
	constructor(camera, LookAtPos) {
		this.camera = camera;
		this.camera.lookAt(LookAtPos);
		this.cameraStart = camera.position.clone();
		this.lookAtAddedVector = new THREE.Vector3(0, 0, 0);
		this.lookAtObj = undefined;
		this.followObject = undefined;
		this.thetaRotateFreq = 0;
		this.phiRotateFreq = 0;
		this.transRadius = 0;
		this.transPhi = 0;
		this.transTheta = 0;
		this.wrapAroundPhi = false;
	}

	getCamera() {
		return this.camera;
	}

	follow(obj) {
		this.followObject = obj;
		this.followObject.updateMatrixWorld();
		this.objectStart = obj.position.clone();
	}

	focusOn(obj, addedVector) {
		this.lookAtObj = obj;
		if(addedVector != undefined) {
			this.lookAtAddedVector = addedVector;
		}
		if(this.lookAtObj != undefined) {
			this.lookAtObj.updateMatrixWorld();
			this.camera.lookAt(this.lookAtAddedVector.clone().add(this.lookAtObj.getWorldPosition()));
		}
	}

	update(delta_time) {
		this.updateCameraPosition(delta_time);
		this.updateCameraOrientation();
	}

	updateCameraPosition(delta_time) {
		var pos = this.cameraStart.clone();
		if(this.followObject != undefined) {
			this.followObject.updateMatrixWorld();
			pos.add(this.followObject.getWorldPosition().clone().sub(this.objectStart));
		}
		this.camera.position.set(pos.getComponent(0), pos.getComponent(1), pos.getComponent(2));

		this.updateTransform(delta_time);
	}

	updateTransform(delta_time) {
		this.transPhi += (this.phiRotateFreq * delta_time);
		this.transTheta += this.thetaRotateFreq * delta_time;
		if(this.wrapAroundPhi) {
			this.transPhi %= Math.PI;
		}
		var transVec = new THREE.Vector3(Math.cos(this.transTheta)*Math.sin(this.transPhi%Math.PI), Math.cos(this.transPhi), 
										 Math.sin(this.transTheta)*Math.sin(this.transPhi%Math.PI))
		transVec.multiplyScalar(this.transRadius);
		this.camera.position.add(transVec);
		//console.log(transVec);
	}

	setTransform(radius, phiRate, thetaRate, phiStart, thetaStart, wrapAroundPhi) {
		this.transRadius = radius;
		this.phiRotateFreq = phiRate;
		this.thetaRotateFreq = thetaRate;
		if(wrapAroundPhi != undefined) this.wrapAroundPhi = wrapAroundPhi;
		if(phiStart != undefined) this.transPhi = phiStart;
		if(thetaStart != undefined) this.transTheta = thetaStart;
	}

	updateCameraOrientation() {
		if(this.lookAtObj != undefined) {
			this.lookAtObj.updateMatrixWorld();
			//this.camera.up = new THREE.Vector3(0,0,1);
			this.camera.lookAt(this.lookAtAddedVector.clone().add(this.lookAtObj.getWorldPosition()));
		} else {
			this.camera.lookAt(this.lookAtAddedVector);
		}
	}

	updateWindowResize() {
		if(this.camera.isOrthographicCamera) {
			var asp = (window.innerWidth / window.innerHeight);
			var view = this.camera.top-this.camera.bottom;
			this.camera.left = (view*asp / - 2);
			this.camera.right = (view*asp / 2);
		} else {
	    	this.camera.aspect = window.innerWidth / window.innerHeight;
		}

	    this.camera.updateProjectionMatrix();
	}
}

function createOrtographicCamera(view, x, y, z) {
	if(view == undefined) view = 100; //view = distance top to bottom 
	var aspect = (window.innerWidth / window.innerHeight);
	var camera = new THREE.OrthographicCamera( view*aspect / - 2, view*aspect / 2, view / 2, view / - 2, 1, 1000);

	camera.position.set(x, y, z);
	return camera;
}

function createPerspectiveCamera(x, y, z) {
	var camera = new THREE.PerspectiveCamera(70,
	window.innerWidth / window.innerHeight, 1, 1000);

	camera.position.set(x, y, z);
	return camera;
}

/* Scene related functions and classes */
function createScene() {
	scene = new THREE.Scene();

	//scene.add(new THREE.AxisHelper(15));

	var car1 = new car(0,0,0,5);

	//var orange1 = new orange(0, 0, 0, 10);

	/*
	createPlayerShip(0, 0, 40);

	for(var i=0; i<4; ++i) {
		var moonInv = new moonInvader(-45+i*30, 0, 0, 5);
		moonInv.getObject().rotation.x = 2*Math.PI/4;
		updateList.push(moonInv);
	}

	for(var i=0; i<4; ++i) {
		var moonInv = new moonInvader(-45+i*30, 0, -30, 5);
		moonInv.getObject().rotation.x = 2*Math.PI/4;
		updateList.push(moonInv);
	}
	*/
	
}

/* Render function */
function render(cam) {
	renderer.render(scene, cam);
}
