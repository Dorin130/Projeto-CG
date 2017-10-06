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
window.addEventListener( 'keyup', onKeyUp, false );


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

function onKeyUp(e) {
	if(e.keyCode == 37) 
		playerCar.input("leftRelease");
	if(e.keyCode == 38)
		playerCar.input("upRelease");
	if(e.keyCode == 39)
		playerCar.input("rightRelease");
	if(e.keyCode == 40)	
		playerCar.input("downRelease");	
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
	if(e.keyCode == 37) {
		playerCar.input("left");
		e.preventDefault();
	}
	if(e.keyCode == 38) {
		playerCar.input("up");
		e.preventDefault();
	}
	if(e.keyCode == 39) {
		playerCar.input("right");
		e.preventDefault();
	}
	if(e.keyCode == 40){
		playerCar.input("down");
		e.preventDefault();
	} 	

	
}


/* INIT */
function init() {
	renderer = new THREE.WebGLRenderer({antialias: true});

	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);

	createScene();

	//customCam = new customCamera(createPerspectiveCamera(0, 0, 0), scene.position);
	customCam = new customCamera(createOrtographicCamera(450, 0, 40, 0), scene.position);
	//customCam.focusOn(playerCar.getObject());
	//customCam.follow(playerCar.getObject(), true);
	//customCam.setTransform(30, 0, 0, 0, 0);
	//customCam.setTransform(50, 0, 0, Math.PI/3, 0);
	//customCam.manualControl();

	render(customCam.getCamera());
	animate();
}

/* Event Listener Functions */
function onWindowResize() {
    renderer.setSize( window.innerWidth, window.innerHeight );
    customCam.prepareWindowResize(800,450);
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

	playerCar.update(delta_t);
	customCam.update(delta_t);
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
  	gameRoad.setPosition(-350,0,-120);
  	gameRoad.roadEnd();

  	var gameTable = new table(0,-10, 0, 800, 20, 450);

  	var orange1 = new orange(-80, 10, -30,10);
  	var orange2 = new orange(60, 10, 80,10);
  	var orange3 = new orange(50, 10, -100,10);

  	var butter1 = new butter(-50,20,20);

  	var butterCube1 = new fallenButter(-90,20,-40,15,20,20);
  	butterCube1.setRotation(0,Math.PI/4,0);

  	playerCar = new car(0,5,0,5)
  	playerCar.setRotation(0, Math.PI/2, 0)
  	var butterCube2 = new fallenButter(100,20,-40,15,20,20);
  	//playerCar.setRotation(Math.PI/2, 0, 0)

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

