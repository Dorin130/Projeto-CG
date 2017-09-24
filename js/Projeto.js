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

window.addEventListener( 'mousewheel', mouseWheelHandler, false );
window.addEventListener( 'DOMMouseScroll', MouseWheelHandler, false);

function mouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if(delta == 1) customCam.scrollUp();
	else customCam.scrollDown();
}

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
	customCam2.setTransform(30, 0, Math.PI/8, Math.PI/3, Math.PI/4);
	
	customCam = customCam2;
	customCam.manualControl();

	render(customCam.getCamera());
	animate();
}

/* Event Listener Functions */
function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    customCam.prepareWindowResize();
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

/* Camera related functions */
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
	//var wHub = new WheelHub(30,0,0,5);
	
	//createPlayerShip(0, 0, 40);

	/*
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

