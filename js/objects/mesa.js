class butterSlice {
		/*Width, Height, Depth, TopHeight, TopBorderSize, Color and TopColor are optional*/
	constructor(PosX, PosY, PosZ, Width, Height, Depth) {
		var Width = Width || 30;
		var Height = Height || 20;
		var Depth = Depth || 20;
		var Color = 0xffbf00;

		this.slice = new THREE.Object3D();


		var angle = Math.PI/4;
		var geometry = new THREE.BoxGeometry( Width/4, Height, Depth);
		var material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: false} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX + Width/2 + (Height/2 + Width/8)*Math.sin(angle) , PosY, PosZ ); //ask me irl 
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