class lifeBar extends baseObject {
	constructor(position, scale, nrOfLifes) {
		var radiusSegments = 10;
		var offset = scale*0.05
		var width = scale;
		var widthPerLife = scale*6;
		super(position)

		this.matPhong = new THREE.MeshBasicMaterial();
		this.matGouroud = new THREE.MeshBasicMaterial();
		this.nrOfLifes = nrOfLifes;

		this.lifes = [];


		for(var i=0; i<nrOfLifes; i++) {
			//var life = new THREE.CylinderGeometry( scale*0.2, scale*0.2, widthPerLife, radiusSegments);
    		//var mesh = new THREE.Mesh(life, this.matGouroud);
    		//mesh.rotation.x = Math.PI/2;
    		//mesh.position.z += i*(widthPerLife + offset)
    		var life = new car(0, 0, i*(widthPerLife + offset), 5, true);
    		//life.setRotation(Math.PI/2,0,0);
    		//life.setPosition(position.x, position.y, i*(widthPerLife + offset))
    		var object = new THREE.Object3D();
    		object.add(life)
    		this.lifes[i] = object;
    		this.add(object);
		}
		//this.position.set(position.x, position.y, position.z)
		this.position.z -=  (nrOfLifes-1)*(widthPerLife + offset)/2
	}

	removeLife() {
		if(this.nrOfLifes > 0) {
			this.lifes[this.nrOfLifes - 1].visible = false;
			this.nrOfLifes -= 1
		}
	}
	input(action){
		if(action == "hideLife") {
			for(var i=0; i< this.nrOfLifes; i++) {
				this.lifes[i].visible = !this.lifes[i].visible;
			}
		}
	}
}