class wipbutter extends collidableObject {
	constructor(position, Width, Height, Depth) {
		var corner = new THREE.Vector3(Width/2, Height/2, Depth/2);
		super(position, corner.length()/3);

		var geometry = new new THREE.BoxGeometry( Width, Height, Depth);
		if ( typeof wipbutter.mat1 == 'undefined' || typeof wipbutter.mat2 == 'undefined' ) { //static values
        	wipbutter.mat1 = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
        	wipbutter.mat2 = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: true} );
    	}
    	this.mesh = new THREE.Mesh( geometry, wipbutter.mat1 );
    	this.add(this.mesh);
	}

	toggleMesh() {
		this.mesh.material = (this.mesh.material == wipbutter.mat1)? wipbutter.mat2 : wipbutter.mat1;
	}

	setWireframe(activated) {
		if ( typeof wipbutter.mat1 == 'undefined' || typeof wipbutter.mat2 == 'undefined' ) { //static values
        	wipbutter.mat1 = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: false} );
        	wipbutter.mat2 = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: true} );
    	}
		wipbutter.mat1.wireframe = activated;
		wipbutter.mat2.wireframe = activated;
	}
}