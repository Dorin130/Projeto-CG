class car {
	constructor(PosX, PosY, PosZ, scale) {
		//Movement Defaults (Simple version)
		this.direction = new THREE.Vector3(-1,0,0);
		this.keyInputs = []; //up, down, left, right
		this.keyInputs["up"] = this.keyInputs["down"] = this.keyInputs["left"] = this.keyInputs["right"] = false;
		this.turnDirection = 0; //positive means left
		this.turnSpeed = 2;
		this.acceleration = 0;
		this.speed = 0;
		this.maxSpeed = 250;
		this.minSpeed = -100;
		this.maxAttrition = 15;

		//Creation
		this.car = new THREE.Object3D();
		var geometry = new THREE.BoxGeometry( scale*4, scale*1, scale*2);
		var material = new THREE.MeshBasicMaterial( { color: 0xaa0000, wireframe:false} );
		var box = new THREE.Mesh( geometry, material );
		this.car.add(box);
		
		this.car.add(new dome(scale*.5, scale*.5, scale*0, scale).getObject())
		this.car.add(new axleAndWheel(scale*1.5, -scale*0.3, 0, scale).getObject());
		this.car.add(new axleAndWheel(-scale*1.5, -scale*0.3, 0, scale).getObject());

		this.setPosition(PosX, PosY, PosZ);

		scene.add(this.car);
	}

	setPosition(PosX, PosY, PosZ) {
		this.car.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.car.rotation.set(RotX, RotY, RotZ);
		this.direction.applyAxisAngle(this.car.up, RotY); //assuming you'll never rotate around the other axis
	}

	getObject() {
		return this.car;
	}

	input(action) {
		//Up Arrow Key
		switch(action) {
			case "up":
				this.keyInputs["up"] = true;
				break;
			case "down":
				this.keyInputs["down"] = true;
				break;
			case "left":
				this.keyInputs["left"] = true;
				break;
			case "right":
				this.keyInputs["right"] = true;
				break;
			case "upRelease":
				this.keyInputs["up"] = false;
				break;
			case "downRelease":
				this.keyInputs["down"] = false;
				break;
			case "leftRelease":
				this.keyInputs["left"] = false;
				break;
			case "rightRelease":
				this.keyInputs["right"] = false;
				break;
			default:
				console.log("Input key error: car: no interaction for action '" + action + "'");
				break;
		}
	}

	update(delta_time) {
		this.simpleInputInterpret();
		this.simplePositionUpdate(delta_time);
	}

	simpleInputInterpret(delta_time) {
		var carAcceleration = 0; //attempted acceleration from motor and breaks
		if(this.keyInputs["up"] && !this.keyInputs["down"]) {
			if(this.speed < 0)
				carAcceleration = +150; //moving backwards --> using breaks
			else
				carAcceleration = +50; //moving forward --> using engine
		} else if(this.keyInputs["down"] && !this.keyInputs["up"]) {
			if(this.speed > 0)
				carAcceleration = -150; //moving forward --> using breaks
			else
				carAcceleration = -30; //moving backwards --> using engine
		} else { //car axle attrition applies
			carAcceleration = this.getAttrition();
		}

		var turn = 0; //positive means left
		if(this.keyInputs["left"] && !this.keyInputs["right"]) {
			turn = 1;
		} else if(this.keyInputs["right"] && !this.keyInputs["left"]) {
			turn = -1;
		} else { //both keys or no keys --> keep current direction
			turn = 0;
		}

		this.acceleration = carAcceleration;
		this.turnDirection = turn;
	}

	getAttrition() {
		if(this.speed == 0)
			return 0;
		else if(this.speed > 0)
			return -this.maxAttrition;
		else
			return +this.maxAttrition;
	}

	simplePositionUpdate(delta_time) {
		var speedStopThreshold = 3;
		this.speed += this.acceleration*delta_time;
		this.speed = Math.max(this.minSpeed, Math.min(this.maxSpeed, this.speed)); //Setting speed within bounds
		
		if(Math.abs(this.speed) < speedStopThreshold && Math.abs(this.acceleration) <= this.maxAttrition) this.speed = 0;

		this.car.rotation.y += this.turnDirection*this.turnSpeed*delta_time;
		//this.car.rotateOnAxis(this.car.up, this.turn*this.turnSpeed*delta_time);

		this.direction.applyAxisAngle(this.car.up, this.turnDirection*this.turnSpeed*delta_time);
		//var direction = this.carFront.applyAxisAngle(this.car.up, this.car.rotation.y); //conceptually prettier but less simple

		var x = this.car.position.x;
		var z = this.car.position.z;
		this.car.position.set(x + this.direction.x*this.speed*delta_time, 0, z + this.direction.z*this.speed*delta_time);
	}
}

class axleAndWheel {
	constructor(PosX, PosY, PosZ, scale) {
		this.wheels = new THREE.Object3D();
		var geometry = new THREE.CylinderGeometry( scale*0.1, scale*0.1, scale*2.8, 10);
		var material = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe: false} );
		var cylinder = new THREE.Mesh( geometry, material );

		this.setRotation(Math.PI*(1/2), 0, 0);
		this.setPosition(PosX, PosY, PosZ);
		this.wheels.add(cylinder);
		this.wheels.add(new Wheel(0, 1.4*scale, 0, scale).getObject());
		this.wheels.add(new Wheel(0, -1.4*scale, 0, scale).getObject());
	}

	setPosition(PosX, PosY, PosZ) {
		this.wheels.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.wheels.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.wheels;
	}
}

class Wheel {
	constructor(PosX, PosY, PosZ, scale) {
		this.wheel = new THREE.Object3D();

		var geometry = new THREE.TorusGeometry( scale*.4, scale * .15, 8, 20 );
		var material = new THREE.MeshBasicMaterial( { color: 0xffff00 , wireframe:false } );
		var torus = new THREE.Mesh( geometry, material );

		this.setRotation(Math.PI*(1/2), 0, 0);
		this.setPosition(PosX, PosY, PosZ);
		this.wheel.add(torus);

		this.wheel.add(new WheelHub(0, 0, 0, scale).getObject());

	}

	setPosition(PosX, PosY, PosZ) {
		this.wheel.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.wheel.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.wheel;
	}
}

class WheelHub {
	constructor(PosX, PosY, PosZ, scale) {
		this.wheelHub = new THREE.Object3D();

		var geometry = new THREE.SphereGeometry( scale*0.1, 8, 8 );
		var material = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe:false} );
		var sphere = new THREE.Mesh( geometry, material );

		this.setRotation(Math.PI*(1/2), 0, 0);
		this.setPosition(PosX, PosY, PosZ);
		this.wheelHub.add(sphere);

		var geometry = new THREE.CylinderGeometry( scale*0.02, scale*0.02, scale*0.2, 3);
		var material = new THREE.MeshBasicMaterial( {color: 0xc0c0c0, wireframe: false} );

		var hubPlate = new ringOfMeshes(geometry, material, 20, scale*0.2, 0, 0, 0, true);
		hubPlate.getObject().rotation.x = Math.PI/2;
		this.wheelHub.add(hubPlate.getObject());
	}

	setPosition(PosX, PosY, PosZ) {
		this.wheelHub.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.wheelHub.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.wheelHub;
	}
}

class dome {
	constructor(PosX, PosY, PosZ, scale) {
		this.dome = new THREE.Object3D();

		var geometry = new THREE.CylinderGeometry(scale*1.5, scale*1.5, scale*1.6, 16, 1, false, Math.PI/2+0.5, Math.PI-1);
		//var geometry = new THREE.SphereGeometry( scale, 4, 4, 0, 6.3, 0, 1.6);
		var material = new THREE.MeshBasicMaterial( {color: 0x00aaff, wireframe:false} );
		var cyl1 = new THREE.Mesh( geometry, material );
		cyl1.position.set(0, 0, scale*0.75)



		geometry = new THREE.CylinderGeometry(scale*1.5, scale*1.5, scale*1.7+0.1, 3, 1, true, Math.PI/2+0.5, Math.PI-1.5);
		//var geometry = new THREE.SphereGeometry( scale, 4, 4, 0, 6.3, 0, 1.6);
		material = new THREE.MeshBasicMaterial( {color: 0xc0c0c0, wireframe:false} );
		material.side = THREE.DoubleSide;
		var cyl2 = new THREE.Mesh( geometry, material );

		this.setRotation(Math.PI/2, 0, 0);
		this.setPosition(PosX, PosY, PosZ);
		this.dome.add(cyl1);
		//this.dome.add(cyl2);
	}

	setPosition(PosX, PosY, PosZ) {
		this.dome.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.dome.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.dome;
	}
}
