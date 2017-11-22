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
		this.nrOfLifesOriginal = nrOfLifes
		this.lifes = [];


		for(var i=0; i<nrOfLifes; i++) {
    		var life = new car(0, 0, i*(widthPerLife + offset), 5, true);
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
			return true;
		}
		else {
			return false;
		}
	}
	getLifes() {
		return this.nrOfLifes;
	}
	input(action){
		if(action == "reset") {
			for(var i = 0; i<this.nrOfLifesOriginal; i++) {
				this.lifes[i].visible = true;
			}
		}
	}
}