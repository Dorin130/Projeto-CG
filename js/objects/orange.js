
/* Leaf */
class orangeLeaf {
	constructor(PosX, PosY, PosZ) {
		this.leaf = new THREE.Object3D();

		var leafShape = new THREE.Shape();
		var x = 0, y = 0;
		leafShape.moveTo( x, y );
		leafShape.bezierCurveTo( x, y, x+5, y+8, x, y + 10 );
		leafShape.bezierCurveTo( x-5, y+8, x, y, x, y );
		
		var geometry = new THREE.ShapeGeometry( leafShape, 10);
		var material = new THREE.MeshBasicMaterial( { color: 0x236e2b} );
		material.side = THREE.DoubleSide;
		var leafMesh = new THREE.Mesh( geometry, material ) ;
		leafMesh.position.set(0, -10, 0);
		this.leaf.add(leafMesh);

		var geometry = new THREE.ConeGeometry( 0.2, 10, 3);
		var material = new THREE.MeshBasicMaterial( {color: 0x144a1a} );
		var cone = new THREE.Mesh( geometry, material );
		cone.rotation.x = Math.PI;
		cone.position.set(0, -5, 0);
		this.leaf.add(cone);

		this.setPosition(PosX, PosY, PosZ);
	}

	setPosition(PosX, PosY, PosZ) {
		this.leaf.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.leaf.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.leaf;
	}
}

class orangeLeafStem {
	constructor(PosX, PosY, PosZ) {
		this.stem = new THREE.Object3D();

		var leaf1 = new orangeLeaf(0, 1, 0);
		leaf1.setRotation(Math.PI*(1/2-1/12), 0, 0);
		var leaf2 = new orangeLeaf(0, 1, 0);
		leaf2.setRotation(-Math.PI*(1/2-1/12), 0, 0);
		this.stem.add(leaf1.getObject());
		this.stem.add(leaf2.getObject());

		var geometry = new THREE.ConeGeometry( 0.4, 3, 6 );
		var material = new THREE.MeshBasicMaterial( {color: 0x144a1a} );
		var cone = new THREE.Mesh( geometry, material );
		cone.position.set(0, 0.5, 0);
		cone.rotation.x = Math.PI;
		this.stem.add(cone);

		this.setPosition(PosX, PosY, PosZ);
	}

	setPosition(PosX, PosY, PosZ) {
		this.stem.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.stem.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.stem;
	}
}

class wiporange extends randomizableObject {
	constructor(position, sphereRadius) {
		super(position, sphereRadius);

		var geometry = new THREE.SphereGeometry( sphereRadius, 12, 12 );
		this.matPhong = BUTTER_MATERIAL[0];
		this.matGouroud = BUTTER_MATERIAL[1];
		this.mesh = new THREE.Mesh( geometry, this.matGouroud );
		this.orange = new THREE.Object3D();
		this.orange.add(this.mesh);
		this.add(this.orange);
		scene.add(this);

	}

	randomizerUpdater(delta_t) {
		this.setPosition(this.orange.position.x + this.randomizerInputs.x,this.orange.position.y+ this.randomizerInputs.y, this.orange.position.z +  this.randomizerInputs.z);
		var distance = Math.sqrt(this.randomizerInputs.x^2 + this.randomizerInputs.z ^2 );
		this.orange.rotateOnAxis(this.rotationAxis, -this.currentSpeed* delta_t/this.sphereRadius);//w = v/r
	}

	update(delta_t) {
		this.randomizerUpdater(delta_t)
	}

}


class orange extends randomizableObject {
	constructor(PosX, PosY, PosZ, sphereRadius) {
		super();
		this.orange = new THREE.Object3D();
		this.sphereRadius = sphereRadius;
		var geometry = new THREE.SphereGeometry( sphereRadius, 12, 12 );
		var material = new THREE.MeshBasicMaterial( {color: 0xbe822d} );
		//var texture = new THREE.TextureLoader().load( "textures/orange-skin.jpg" );
		//texture.wrapS = THREE.RepeatWrapping;
		//texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.set( 4, 4 );
		//var material = new THREE.MeshBasicMaterial( { color: 0xbe822d, map: texture} );
		var sphere = new THREE.Mesh( geometry, material );
		//this.orange.add(new THREE.AxisHelper(100));
		this.orange.add(sphere);
		this.orange.add(new orangeLeafStem(0, sphereRadius, 0).getObject());
		this.orange.rotation.z = Math.random()*Math.PI/2;
		this.orange.rotation.x = Math.random()*Math.PI/2;
		this.orange = new THREE.Object3D().add(this.orange);
		this.orange.position.set(PosX, PosY, PosZ);
		scene.add(this.orange);

		this.boundingRadius = sphereRadius;
	}

	setPosition(PosX, PosY, PosZ) {
		this.orange.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.orange.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.orange;
	}
	getPosition() {
		return this.orange.position;
	}
	randomizerUpdater(delta_t) {
		this.setPosition(this.orange.position.x + this.randomizerInputs.x,this.orange.position.y+ this.randomizerInputs.y, this.orange.position.z +  this.randomizerInputs.z);
		var distance = Math.sqrt(this.randomizerInputs.x^2 + this.randomizerInputs.z ^2 );
		this.orange.rotateOnAxis(this.rotationAxis, -this.currentSpeed* delta_t/this.sphereRadius);//w = v/r
	}

	update(delta_t) {
		this.randomizerUpdater(delta_t)
	}

	getTentativePosition() {
		return this.getPosition();
	}

	
}
