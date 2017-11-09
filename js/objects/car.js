class dome extends baseObject {
	constructor(PosX, PosY, PosZ, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ));

		var geometry = new THREE.CylinderGeometry(scale*1.5, scale*1.5, scale*1.6, 16, 1, false, Math.PI/2+0.5, Math.PI-1);
		this.matPhong = CAR_DOME_MATERIAL[0];
		this.matGouroud = CAR_DOME_MATERIAL[1];
		this.mesh = new THREE.Mesh( geometry, this.matGouroud );
		this.mesh.rotation.set(Math.PI/2, 0, 0);
		//this.cyl.position.set(0, 0, scale*0.75);
		this.add(this.mesh);
	}
}

class rims extends baseObject {
	constructor(PosX, PosY, PosZ, number, radius, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ));
		var cylgeometry = new THREE.CylinderGeometry( scale*0.02, scale*0.02, scale*0.2, 3);
		if ( typeof rims.mat1 == 'undefined' || typeof rims.mat2 == 'undefined' ) { //static values
			rims.mat1 = new THREE.MeshBasicMaterial( {color: 0xc0c0c0, wireframe: false} );
			rims.mat2 = new THREE.MeshBasicMaterial( {color: 0xc0c0c0, wireframe: false} );
		}
		var theta = 0;
		var interval = 2*Math.PI/number;
		for(var i=0; i < number; i++) {
			var newMesh = new THREE.Mesh( cylgeometry, rims.mat1 )
			newMesh.position.set(radius*Math.cos(theta), radius*Math.sin(theta), 0);
			newMesh.rotation.z = theta-(1/2)*Math.PI;
			theta += interval;
			this.add( newMesh );
		}
	}

	toggleMesh() {
		for(var i=0; i<this.children.length; i++) {
			this.children[i].mesh.material = 
			(this.children[i].mesh.material == rims.mat1)? rims.mat2 : rims.mat1;
		}
	}

	setWireframe(activated) {
		rims.mat1.wireframe = activated;
		rims.mat2.wireframe = activated;
	}

}


class wheelHub extends baseObject {
	constructor(PosX, PosY, PosZ, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ));

		var geometry = new THREE.SphereGeometry( scale*0.1, 8, 8 );
		if ( typeof wheelHub.mat1 == 'undefined' || typeof wheelHub.mat2 == 'undefined' ) { //static values
			wheelHub.mat1 = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe:false} );
			wheelHub.mat2 = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe:false} );
		}
		this.sphere = new THREE.Mesh( geometry, wheelHub.mat1 );
		this.hubRims = new rims(0, 0, 0, 10, scale*0.2, scale);

		this.add(this.sphere);
		this.add(this.hubRims);
	}

	toggleMesh() {
		this.sphere.material = (this.sphere.material == wheelHub.mat1)? wheelHub.mat2 : wheelHub.mat1;
		this.hubRims.toggleMesh();
	}

	setWireframe(activated) {
		wheelHub.mat1.wireframe = activated;
		wheelHub.mat2.wireframe = activated;
		this.hubRims.setWireframe(activated);
	}
}

class wheel extends baseObject {
	constructor(PosX, PosY, PosZ, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ));

		this.radius = scale*.4
		var geometry = new THREE.TorusGeometry( scale*.4, scale * .15, 8, 20 );
		if ( typeof wheel.mat1 == 'undefined' || typeof wheel.mat2 == 'undefined' ) { //static values
			wheel.mat1 = new THREE.MeshBasicMaterial( { color: 0xffff00 , wireframe:false } );
			wheel.mat2 = new THREE.MeshBasicMaterial( { color: 0xffff00 , wireframe:false } );
		}
		this.torus = new THREE.Mesh( geometry, wheel.mat1 );
		this.hub = new wheelHub(0, 0, 0, scale);
		this.torus.rotation.set(Math.PI/2,0,0);
		this.hub.setRotation(Math.PI/2,0,0);
		this.wheelJoint = new THREE.Object3D();
		this.wheelJoint.add(this.torus);
		this.wheelJoint.add(this.hub);
		this.add(this.wheelJoint);
	}

	spin(angle) {
		this.wheelJoint.rotateOnAxis(this.up, angle);
		this.wheelJoint.rotateOnAxis(this.up, angle);
	}

	toggleMesh() {
		this.wheelJoint.torus.material = (this.torus.material == wheel.mat1)? wheel.mat2 : wheel.mat1;
		this.wheelJoint.hub.toggleMesh();
	}

	setWireframe(activated) {
		wheel.mat1.wireframe = activated;
		wheel.mat2.wireframe = activated;
		this.wheelJoint.hub.setWireframe(activated);
	}
}


class axleAndWheel extends baseObject {
	constructor(PosX, PosY, PosZ, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ));

		var geometry = new THREE.CylinderGeometry( scale*0.1, scale*0.1, scale*2.8, 10);
		if ( typeof axleAndWheel.mat1 == 'undefined' || typeof axleAndWheel.mat2 == 'undefined' ) { //static values
			axleAndWheel.mat1 = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe: false} );
			axleAndWheel.mat2 = new THREE.MeshBasicMaterial( {color: 0x808080, wireframe: false} );
		}
		this.axle = new THREE.Mesh( geometry, axleAndWheel.mat1 );
		this.leftWheel = new wheel(0, 1.4*scale, 0, scale);
		this.rightWheel = new wheel(0, -1.4*scale, 0, scale);

		this.add(this.axle);
		this.add(this.leftWheel);
		this.add(this.rightWheel);
	}

	turnWheels(angle) {
		this.leftWheel.setRotation(angle,0,0);
		this.rightWheel.setRotation(angle,0,0);
	}
	rotateWheels(angle) {
		this.leftWheel.spin(angle);
		this.rightWheel.spin(angle);
	}

}


class car extends physicalObject {
	constructor(PosX, PosY, PosZ, scale) {
		super(new THREE.Vector3(PosX, PosY, PosZ), 3*scale, 5, 20, 100);
		this.setBoundingOffset(new THREE.Vector3(0,-3,0));
		//Movement Defaults (Simple version)
		this.direction = new THREE.Vector3(-1,0,0);
		this.initialDirection = this.direction.clone();

		this.stuck = false;
		this.keyInputs = []; //up, down, left, right
		this.keyInputs["up"] = this.keyInputs["down"] = this.keyInputs["left"] = this.keyInputs["right"] = false;
		this.turnDirection = 0; //positive means left
		this.turnSpeed = 3;

		this.forwardMaxSpeed = 250;
		this.backwardsMaxSpeed = 100;

		//Creation
		var geometry = new THREE.BoxGeometry( scale*4, scale*1, scale*2);
		if ( typeof car.mat1 == 'undefined' || typeof car.mat2 == 'undefined' ) { //static values
			car.mat1 = new THREE.MeshBasicMaterial( {color: 0xaa0000, wireframe:false} );
			car.mat2 = new THREE.MeshBasicMaterial( {color: 0xaa0000, wireframe:false} );
		}
		this.chassis = new THREE.Mesh( geometry, car.mat1 );
		this.rearAxis = new axleAndWheel(scale*1.5, -scale*0.3, 0, scale);
		this.frontAxis = new axleAndWheel(-scale*1.5, -scale*0.3, 0, scale);
		this.rearAxis.setInitialRotation(Math.PI/2, Math.PI/2, 0);
		this.frontAxis.setInitialRotation(Math.PI/2, Math.PI/2, 0);

		this.dome = new dome(scale*.5, -scale*.3, scale*0, scale);

		this.add(this.chassis);
		this.add(this.dome);
		this.add(this.rearAxis);
		this.add(this.frontAxis);
	}

	setRotation(RotX, RotY, RotZ) {
		this.rotation.set(RotX, RotY, RotZ);
		this.direction.set(-1,0,0);
		this.direction.applyAxisAngle(this.up, RotY);
		this.speed.copy(this.direction.clone().multiplyScalar(this.speed.length()));
		this.tentativeSpeed.copy(this.speed);
	}

	axisRotation(axis, angle) {
		this.rotateOnAxis(axis, angle);
		this.direction.applyAxisAngle(axis, angle); //assuming you'll never rotate around the other axis
		this.speed.applyAxisAngle(axis, angle);
		this.tentativeSpeed.applyAxisAngle(axis, angle);
		this.acceleration.applyAxisAngle(axis, angle);
	}

	setInitialRotation(RotX, RotY, RotZ) {
		this.setRotation(RotX, RotY, RotZ);
		this.initialRotation.copy(this.rotation);
		this.initialDirection.copy(this.direction);
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
				break;
		}
	}


	simpleInputInterpret() {
		if(this.keyInputs["up"] && !this.keyInputs["down"] && !this.stuck) {
			if(this.speed.dot(this.direction) < 0)
				this.acceleration = this.direction.clone().multiplyScalar(+200); //moving backwards --> using breaks
			else
				this.acceleration = this.direction.clone().multiplyScalar(+75); //moving forward --> using engine
		} else if(this.keyInputs["down"] && !this.keyInputs["up"] && !this.stuck) {
			if(this.speed.dot(this.direction) >= 0)
				this.acceleration = this.direction.clone().multiplyScalar(-200) //moving forward --> using breaks
			else
				this.acceleration = this.direction.clone().multiplyScalar(-45) //moving backwards --> using engine
		} else {
			this.acceleration.setLength(0);
		}

		var turn = 0; //positive means left
		if(this.keyInputs["left"] && !this.keyInputs["right"]) {
			turn = 1;
		} else if(this.keyInputs["right"] && !this.keyInputs["left"]) {
			turn = -1;
		} else { //both keys or no keys --> keep current direction
			turn = 0;
		}
		this.turnDirection = turn;
	}

	getTurnSpeed() {
		var maxTurnAtSpeed = 50
		if(Math.abs(this.speed.length()) > maxTurnAtSpeed) {
			return this.turnSpeed - this.speed.length()/this.forwardMaxSpeed;
		} else if(Math.abs(this.speed.length()) > this.speedStopThreshold) {
			return Math.max(0, (this.speed.length()-this.speedStopThreshold)/maxTurnAtSpeed*this.turnSpeed);
		} else 
			return 0;
	}

	simpleRotationUpdate(delta_time) {
		//Setting speed within bounds
		if(this.speed.dot(this.direction) < 0) this.speed.setLength(Math.min(this.backwardsMaxSpeed, this.speed.length()));
		else this.speed.setLength(Math.min(this.forwardMaxSpeed, this.speed.length()));
		this.axisRotation(this.up, this.turnDirection*this.getTurnSpeed()*delta_time*Math.sign(this.speed.dot(this.direction)));
		this.frontAxis.turnWheels(this.turnDirection/3);
		this.frontAxis.rotateWheels(this.speed.dot(this.direction)*delta_time/(this.frontAxis.leftWheel.radius*2*Math.PI));
		this.rearAxis.rotateWheels(this.speed.dot(this.direction)*delta_time/this.frontAxis.leftWheel.radius);
	}

	getTentativePosition() {
		return this.tentativePos.clone();
	}

	butterCollision() {
		this.stuck = true;
		this.resetSpeedAndAccel();
	}

	speedUpdate(delta_time) {
		this.speed.copy(this.tentativeSpeed);
		this.simpleInputInterpret();
		var preFriction = this.speed.add(this.acceleration.clone().multiplyScalar(delta_time));
		var postFriction = this.speed.add(this.getFriction().multiplyScalar(delta_time));
		if(preFriction.dot(postFriction) <= 0 ||
		(postFriction.length() <= this.speedStopThreshold)&&this.acceleration.length() == 0) {
			this.speed.set(0,0,0);
		}
		this.simpleRotationUpdate(delta_time);
		this.tentativeSpeed.copy(this.speed);
	}

	reset() {
		this.setPosition(this.initialPosition.x, this.initialPosition.y, this.initialPosition.z);
		this.setRotation(this.initialRotation.x, this.initialRotation.y, this.initialRotation.z);//this.setRotation(0,Math.PI,0);
		this.resetSpeedAndAccel();
		this.stuck = false;
		//this.propagateReset();
	}
}