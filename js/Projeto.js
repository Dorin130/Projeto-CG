/* GLOBAL THREE */
'use strict'

/* Global variables */
var globalAspectRatio = 16/9;

var pause = false;

var scene, renderer, customCam;
var customCamManager;
var collManager;

var updateList = []; /* contains every object to be updated in the update cycle except customCamera */
var inputList = []; /* contains every object to be updated in the update cycle except customCamera */


//COLLIDING OBJECT LISTS
var playerCar;
var orangeList = [];
var butterList = [];
var cheerioList = [];

var clock = new THREE.Clock();

/* Event Listeners */

//camera resize
window.addEventListener( 'resize', onWindowResize, false );

//camera zoom
window.addEventListener( 'mousewheel', mouseWheelHandler, false );
window.addEventListener( 'DOMMouseScroll', mouseWheelHandler, false );

//car control
window.addEventListener( 'keydown', onKeyDown, false );
window.addEventListener( 'keyup', onKeyUp, false );


/* Event Listener Functions */
function onWindowResize() {
    renderer.setSize( getRendererWidth(), getRendererHeight() );
    customCamManager.prepareWindowResize();
}

function mouseWheelHandler(e) {
	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
	if(delta == 1) customCamManager.input("scrollUp");
	else customCamManager.input("scrollDown");
}

function onKeyUp(e) {
	var action = "";
	switch(e.keyCode) {
		case 37:
			action = "leftRelease";
			break;
		case 38:
			action = "upRelease";
			break;
		case 39:
			action = "rightRelease";
			break;
		case 40:
			action = "downRelease";
			break;
	}
	for(var i = 0; i<inputList.length && action != ""; i++) { /* notices each individual object that 'asks' to be noticed */
		if(inputList[i].input != undefined) { inputList[i].input(action); }
	}
}

function onKeyDown(e) {
	var action = "";
	switch(e.keyCode) {
		case 37:
			action = "left";
			e.preventDefault();
			break;
		case 38:
			action = "up";
			e.preventDefault();
			break;
		case 39:
			action = "right";
			e.preventDefault();
			break;
		case 40:
			action = "down";
			e.preventDefault();
			break;
		case 65:
			scene.traverse(function (node) {
				if (node instanceof THREE.Mesh)
					node.material.wireframe = !node.material.wireframe;
			});
			e.preventDefault();
			break;
		case 49:
			action = "1";
			e.preventDefault();
			break;
		case 50:
			action = "2";
			e.preventDefault();
			break;
		case 51:
			action = "3";
			e.preventDefault();
			break;
		default:
	}
	for(var i = 0; i<inputList.length && action != ""; i++) { /* notifies each individual object that 'asks' to be notified */
		if(inputList[i].input != undefined) { inputList[i].input(action); }

	}
}


/* INIT */
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( getRendererWidth(), getRendererHeight() );
	document.body.appendChild(renderer.domElement);

	createScene();

	var cam1 = new customCamera(createOrtographicCamera(450, 0, 40, 0, globalAspectRatio), scene.position);

	var cam2 = new customCamera(createPerspectiveCamera(0, 400, 200, globalAspectRatio), scene.position);

	var cam3 = new customCamera(createPerspectiveCamera(0, 0, 0, globalAspectRatio), scene.position);
	cam3.focusOn(playerCar.getObject());
	cam3.follow(playerCar.getObject(), true);
	cam3.setTransform(50, 0, 0, Math.PI/3, 0);
	cam3.manualControl();

 	customCamManager = new cameraManager(cam1, "1");
 	customCamManager.addCamera(cam2, "2");
 	customCamManager.addCamera(cam3, "3");
	inputList.push(customCamManager);

	render(customCamManager.getCurrentCam());
	animate();
}


/* Scene related functions and classes */
function createScene() {
	scene = new THREE.Scene();
	//scene.add(new THREE.AxisHelper(15));

  	var road = [];
  	road.push.apply(road, straightLine(20, new THREE.Vector3(0,0,40), new THREE.Vector3(0,0,40), true));
  	road.push.apply(road, straightLine(20, new THREE.Vector3(10,0,180), new THREE.Vector3(10,0,180), true));
	/*road.push.apply(road, straightLine(20, new THREE.Vector3(120,0,0), new THREE.Vector3(120,0,100), true));
	road.push.apply(road, straightLine(20, new THREE.Vector3(100,0,10), new THREE.Vector3(100,0,90), true));
	road.push.apply(road, straightLine(20, new THREE.Vector3(80,0,20), new THREE.Vector3(80,0,80), true));
	road.push.apply(road, straightLine(20, new THREE.Vector3(60,0,30), new THREE.Vector3(60,0,70), true));
	road.push.apply(road, straightLine(20, new THREE.Vector3(40,0,40), new THREE.Vector3(40,0,60), true));
	road.push.apply(road, straightLine(20, new THREE.Vector3(20,0,50), new THREE.Vector3(20,0,50), true));*/
	//road.push.apply(road, straightLine(10, new THREE.Vector3(30,0,30), new THREE.Vector3(30,0,100), false));
	/*road.push.apply(road, curvedLine(20, new THREE.Vector3(100,0,70),
										new THREE.Vector3(200,0,-200), new THREE.Vector3(0,1,0), 0,false));*/
	cheerioList = fillPos(road);
	updateList.push.apply(updateList, cheerioList);
  	var gameTable = new table(0,-10, 0, 800, 20, 450);


  	var butter1 = new butter(-50,20,20);

  	var pathRandomizer = new randomizer(400,10,225);
  	orangeList = pathRandomizer.createOranges(5, 15, 10);
  	butterList = pathRandomizer.createButters(5, 10, 10,10,20);


  	playerCar = new car(0,5,0,5)
  	playerCar.setRotation(0, Math.PI/2, 0)
	updateList.push(pathRandomizer);	
	updateList.push(playerCar);
	inputList.push(playerCar);

	collManager = new collisionManager(playerCar, cheerioList, orangeList, butterList);
}

/* Animation main function and update/render cycle */
function animate() {
	if (pause) {return}
	requestAnimationFrame(animate);

	//update:
	var delta_t = clock.getDelta();

	for(var i = 0; i<cheerioList.length; i++) { //computes tentative position for all collision affectable objects (cheerios)
		cheerioList[i].firstTentative(delta_t);
	}

	collManager.checkAllCollisions();

	for(var i = 0; i<updateList.length; i++) { //updates each individual object
		if(updateList[i].update != undefined) { updateList[i].update(delta_t); }
	}

	customCamManager.update(delta_t);

	//render:
	render(customCamManager.getCurrentCam());
}

/* Render function */
function render(cam) {
	renderer.render(scene, cam);
}

function getRendererWidth() {
	if(window.innerWidth/window.innerHeight >= globalAspectRatio) {
		return window.innerHeight*globalAspectRatio;
	} else {
		return window.innerWidth;
	}
}

function getRendererHeight() {
	if(window.innerWidth/window.innerHeight >= globalAspectRatio) {
		return window.innerHeight;
	} else {
		return window.innerWidth/globalAspectRatio;
	}
}

function resetCameras() {
	var cam3 = new customCamera(createPerspectiveCamera(0, 0, 0, globalAspectRatio), scene.position);
	cam3.focusOn(playerCar.getObject());
	cam3.follow(playerCar.getObject(), true);
	cam3.setTransform(50, 0, 0, Math.PI/3, 0);
	cam3.manualControl();

	customCamManager.addCamera(cam3, "3");
}

function resetGame() {
	pause = true;
	createScene();
	resetCameras();
	pause = false;
	animate();
}