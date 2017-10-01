class table {
	constructor(PosX, PosY, PosZ, Width, Height, Depth) {
		var Width = Width || 200;
		var Height = Height || 20;
		var Depth = Depth || 200;
		var Color = 0x996600;

		this.table = new THREE.Object3D();

		var geometry = new THREE.BoxGeometry( Width, Height, Depth);
		var material = new THREE.MeshBasicMaterial( {color: Color, wireframe: false} );
		var mesh = new THREE.Mesh( geometry, material );
		mesh.position.set(PosX , PosY, PosZ ); 

		this.table.add(mesh);

	}

	setPosition(PosX, PosY, PosZ) {
		this.table.position.set(PosX, PosY, PosZ)
	}

	setRotation(RotX, RotY, RotZ) {
		this.table.rotation.set(RotX, RotY, RotZ);
	}

	getObject() {
		return this.table;
	}
}