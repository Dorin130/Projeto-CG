class butterSlice {
		/*Width, Height, Depth, TopHeight, TopBorderSize, Color and TopColor are optional*/
	constructor(PosX, PosY, PosZ, Width, Height, Depth, TopHeight, TopBorderSize, Color, TopColor) {
		var Width = Width || 30;
		var Height = Height || 20;
		var Depth = Depth || 20;
		var TopHeight = TopHeight || 3;
		var TopBorderSize = TopBorderSize || 2;
		var Color = Color || 0xffbf00;
		var TopColor = TopColor || 0xffff00;

		this.slice = new THREE.Object3D();


		var angle = Math.PI/4;
		var geometry = new THREE.BoxGeometry( Width/4, Height, Depth);
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: false} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + Width/2 + (Height/2 + Width/8)*Math.sin(angle) , PosY, PosZ );
		mesh.rotation.z = angle;
		this.slice.add(mesh);


	}

	setPosition(PosX, PosY, PosZ) {
		this.slice.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.slice.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.slice;
	}
}

class butterCube {
		/*Width, Height, Depth, TopHeight, TopBorderSize, Color and TopColor are optional*/
	constructor(PosX, PosY, PosZ, Width, Height, Depth, TopHeight, TopBorderSize, Color, TopColor) {
		var Width = Width || 30;
		var Height = Height || 20;
		var Depth = Depth || 20;
		var TopHeight = TopHeight || 3;
		var TopBorderSize = TopBorderSize || 2;
		var Color = Color || 0xffbf00;
		var TopColor = TopColor || 0xffff00;

		this.slice = new THREE.Object3D();


		var angle = Math.PI/4;
		var geometry = new THREE.BoxGeometry( Width/4, Height, Depth);
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: false} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + Width/2 + (Height/2 + Width/8)*Math.sin(angle) , PosY, PosZ );
		mesh.rotation.z = angle;
		this.slice.add(mesh);


	}

	setPosition(PosX, PosY, PosZ) {
		this.slice.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.slice.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.slice;
	}
}
class butterPlate {
		/*Width, Height, Depth, TopHeight, TopBorderSize, Color and TopColor are optional*/
	constructor(PosX, PosY, PosZ, Width, Height, Depth, TopHeight, TopBorderSize, Color, TopColor) {
		var Width = Width || 30;
		var Height = Height || 20;
		var Depth = Depth || 20;
		var TopHeight = TopHeight || 3;
		var TopBorderSize = TopBorderSize || 2;
		var Color = Color || 0xffbf00;
		var TopColor = TopColor || 0xffff00;

		this.butterPlate = new THREE.Object3D();
		var angle = Math.PI/4;
		geometry = new THREE.BoxGeometry( Width + (Height + Width/4)*Math.sin(angle) + 10, Height/4, Depth + 10);
		material = new THREE.MeshBasicMaterial( {color: 0xd3d3d3, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX+ (Height/2 + Width/8)*Math.sin(angle), PosY - Height/2 - Height/4, PosZ);
		this.butterPlate.add(mesh);

		geometry = new THREE.BoxGeometry( Height/4 , Height/2, Depth + 10 + Height/4 );
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + (Height/2 + Width/8)*Math.sin(angle) + Width, PosY - Height/2 - Height/8 , PosZ);
		this.butterPlate.add(mesh);


		geometry = new THREE.BoxGeometry( Height/4 , Height/2, Depth + 10 + Height/4);
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX - Width + (Height/2 + Width/8)*Math.sin(angle) , PosY - Height/2 - Height/8 , PosZ);
		this.butterPlate.add(mesh);

		geometry = new THREE.BoxGeometry( Height/4 , Height/2, Width +(Height + Width/4)*Math.sin(angle) + 10  );
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + (Height/2 + Width/8)*Math.sin(angle)  , PosY - Height/2 - Height/8  , PosZ - (Depth + 10)/2);
		mesh.rotation.y = Math.PI/2;
		this.butterPlate.add(mesh);

		geometry = new THREE.BoxGeometry( Height/4 , Height/2, Width +(Height + Width/4)*Math.sin(angle) + 10  );
		material = new THREE.MeshBasicMaterial( {color: 0xffffff, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + (Height/2 + Width/8)*Math.sin(angle)  , PosY - Height/2 - Height/8  , PosZ + (Depth + 10)/2);
		mesh.rotation.y = Math.PI/2;
		this.butterPlate.add(mesh);


	}

	setPosition(PosX, PosY, PosZ) {
		this.butterPlate.position.set(PosX, PosY, PosZ);
	}

	setRotation(RotX, RotY, RotZ) {
		this.butterPlate.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.butterPlate;
	}
}


class butter {
	/*Width, Height, Depth, TopHeight, TopBorderSize, Color and TopColor are optional*/
	constructor(PosX, PosY, PosZ, Width, Height, Depth, TopHeight, TopBorderSize, Color, TopColor) {
		var Width = Width || 30;
		var Height = Height || 20;
		var Depth = Depth || 20;
		var TopHeight = TopHeight || 3;
		var TopBorderSize = TopBorderSize || 2;
		var Color = Color || 0xffbf00;
		var TopColor = TopColor || 0xffff00;

		this.butter = new THREE.Object3D();
		this.slice = new butterSlice(0,0,0).getObject();
		this.butterCube = new THREE.Object3D();
		this.butterPlate = new butterPlate(0,0,0).getObject();

		var geometry = new THREE.BoxGeometry( Width, Height, Depth );
		var material = new THREE.MeshBasicMaterial( {color: Color, wireframe: false} );
		var mesh = new THREE.Mesh( geometry, material );
		this.butter.add(mesh);

		var angle = Math.PI/4;


		geometry = new THREE.BoxGeometry( Width/4, Height/2, Depth/2);
		material = new THREE.MeshBasicMaterial( {color: 0xffef00, wireframe: false} );
		mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX - Width/4 , PosY + Height/2 + Width/8, PosZ - Width/8);
		mesh.rotation.z = Math.PI/2;
		mesh.rotation.y = Math.PI/6;
		this.butterCube.add(mesh);


		

		scene.add( this.butter);
		scene.add(this.slice);
		scene.add(this.butterCube);
		scene.add(this.butterPlate)
	}

	setPosition(PosX, PosY, PosZ) {
		this.butter.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.butter.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.butter;
	}
}
