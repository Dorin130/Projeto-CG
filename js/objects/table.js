class table extends baseObject {
	constructor(PosX, PosY, PosZ, Width, Height, WSegments, HSegments) {
		super(new THREE.Vector3(PosX, PosY, PosZ));
		var Color = 0x5B1F03;

		var geometry = new THREE.PlaneGeometry( Width, Height, WSegments,HSegments );
		var material = new THREE.MeshLambertMaterial( {color: Color, wireframe: false} );
		this.mesh = new THREE.Mesh( geometry, material );
		this.mesh.rotation.x = -Math.PI/2;
		this.add(this.mesh);

		scene.add(this);
	}
}
