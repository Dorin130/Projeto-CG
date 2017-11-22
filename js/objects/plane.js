class plane extends baseObject {
	constructor(position,width, height, color, texture) {
		super(position)
		var geometry = new THREE.PlaneGeometry( width, height, 32 );
		var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide, map: texture} );
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = Math.PI/2
		plane.rotation.z = Math.PI/2
		this.add(plane)
	}

}