/* GLOBAL THREE */
'use strict'

/* Global variables */
var globalAspectRatio = 16/9;

var scene, renderer, customCam;
var customCamManager;

var updateList = []; /* contains every object to be updated in the update cycle except customCamera */
var inputList = []; /* contains every object to be updated in the update cycle except customCamera */
var playerCar;

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

	//CREATION OF A ROAD EXAMPLE
  	var gameRoad = new road(0, 0, 0, 7, 30, 3, 1);
    gameRoad.roadBegin();
    gameRoad.straightRoad(18);
	gameRoad.roadCurve(Math.PI/2, 30);
	gameRoad.straightRoad(39);
	gameRoad.roadCurve(Math.PI*(1/2+1/3), 100);
	gameRoad.straightRoad(15);
	gameRoad.roadCurve(Math.PI*(1-1/2-1/3), 10);
	gameRoad.straightRoad(30);
	gameRoad.roadCurve(Math.PI/2, 24);
  	gameRoad.setPosition(-350, 1,-120);
  	gameRoad.roadEnd();

  	var gameTable = new table(0,-10, 0, 800, 20, 450);

  	var orange1 = new orange(-80, 10, -30,10);
  	var orange2 = new orange(60, 10, 80,10);
  	var orange3 = new orange(50, 10, -100,10);

  	var butter1 = new butter(-50,20,20);

  	var butterCube1 = new fallenButter(-90,20,-40,15,20,20);
  	butterCube1.setRotation(0,Math.PI/4,0);
  	var butterCube2 = new fallenButter(100,20,-40,15,20,20);

  	playerCar = new car(0,5,0,5)
  	playerCar.setRotation(0, Math.PI/2, 0)
	
	updateList.push(playerCar);
	inputList.push(playerCar);
}

/* Animation main function and update/render cycle */
function animate() {
	requestAnimationFrame(animate);

	//update:
	var delta_t = clock.getDelta();
	
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