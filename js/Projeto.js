/* GLOBAL THREE */
'use strict'

/* Global variables */
var scene, renderer, customCam;

var playerCar;

var geometry, material, mesh;

var updateList = []; /* contains every object to be updated in the update cycle except customCamera */

var clock = new THREE.Clock();
var totalTime = 0;

/* Event Listeners */
//camera resize
window.addEventListener( 'resize', onWindowResize, false );

//camera zoom
window.addEventListener( 'mousewheel', mouseWheelHandler, false );
window.addEventListener( 'DOMMouseScroll', mouseWheelHandler, false );

//car control
window.addEventListener( 'keydown', onKeyDown, false );

/* INIT */
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	var focus = createScene();

	var customCam2 = new customCamera(createOrtographicCamera(200, 0, 40, 0), scene.position);
	
	//var customCam2 = new customCamera(createPerspectiveCamera(0, 0, 0), scene.position);
	customCam2.focusOn(playerCar.getObject());
	customCam2.follow(playerCar.getObject());
	customCam2.setTransform(30, 0, 0, 0, 0);
	
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

function mouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if(delta == 1) customCam.scrollUp();
	else customCam.scrollDown();
}


window.addEventListener( 'keydown', onKeyDown, false);
window.addEventListener('keyup', onKeyUp, false);

function onKeyUp(e) {
	if(e.keyCode == 37) 
		playerCar.move("release");
	if(e.keyCode == 39)
		playerCar.move("release");
}

function onKeyDown(e) {
	switch(e.keyCode) {
		case "a":
		break;
		case 65: //a
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh)
					node.material.wireframe = !node.material.wireframe;
			});
			break;
	}
	if(e.keyCode == 37) 
		playerCar.move("left");
	if(e.keyCode == 38)
		playerCar.move("up");
	if(e.keyCode == 39)
		playerCar.move("right");
	if(e.keyCode == 40)	
		playerCar.move("down");	
}


/* INIT */
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	var focus = createScene();

	//customCam = new customCamera(createOrtographicCamera(200, 0, 40, 0), scene.position);
	

	var customCam2 = new customCamera(createOrtographicCamera(200, 0, 40, 0), scene.position);
	//customCam2.focusOn(updateList[0].getObject());
	//customCam2.follow(updateList[0].getObject());
	customCam2.focusOn(playerCar.getObject());
	customCam2.follow(playerCar.getObject());
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
	playerCar.update(delta_t);
	//car1.update(delta_t);	//render
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

	scene.add(new THREE.AxisHelper(15));

	//CREATION OF A ROAD EXAMPLE
  	var roadExample = new road(0,0,0);
    roadExample.roadBegin();
    roadExample.straightRoad(15);
	roadExample.roadCurve(Math.PI/6, 200);
	roadExample.straightRoad(30);
	roadExample.roadCurve(Math.PI, 200);
	roadExample.straightRoad(60);
	roadExample.roadCurve(Math.PI-Math.PI/6, 95);
	roadExample.straightRoad(30);
	
  	roadExample.roadEnd();


  	playerCar = new car(0,0,0,5)
  	playerCar.setRotation(Math.PI/2, 0, 0)

  	//var butter1 = new butter(0,0,0);
	// orange1 = new orange(0, 0, 0, 10);
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

