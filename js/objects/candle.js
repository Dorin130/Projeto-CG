class candle extends baseObject {
	constructor(position, intensity, Height, color) {
		var radiusTop = 3;
		var radiusBottom = 7; 
		var radiusSegments = 10;
		var Height = Height || 50;
		var heightSegments = 10;
		var intensity = intensity || 1;
		var distance = 100;
		var decay = 0 
		var color = color || 0xffffff;

		position.y += Height/2
		super(position);
		console.log(distance)
		this.light = new THREE.PointLight( color, intensity, distance);
		this.light.position.set( position.x, position.y, position.z);
		scene.add( this.light )
		var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, Height, radiusSegments );
		if ( typeof candle.mat1 == 'undefined' || typeof candle.mat2 == 'undefined' ) { //static values
        	candle.mat1 = new THREE.MeshPhongMaterial();
        	candle.mat2 = new THREE.MeshBasicMaterial( { color: 0xAAAAAA, wireframe: true} );
    	}
    	this.mesh = new THREE.Mesh( geometry, candle.mat1 );
    	this.add(this.mesh);


	}

	toggleMesh() {
		this.mesh.material = (this.mesh.material == candle.mat1)? candle.mat2 : candle.mat1;
	}

	setWireframe(activated) {
		candle.mat1.wireframe = activated;
		candle.mat2.wireframe = activated;
	}
}