class car {
	constructor(PosX, PosY, PosZ, scale) {
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
	}

	getObject() {
		return this.car;
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
		scene.add(this.wheelHub);
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
