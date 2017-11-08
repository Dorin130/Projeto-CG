class globalLight extends baseObject {
	constructor(position, intensity, color) {
			super(position);
			this.color = color || 0xffffff;
			this.intensity = intensity || 1;
			this.directionalLight = new THREE.DirectionalLight( this.color, this.intensity );
			this.directionalLight.position.set(position.x, position.y, position.z);
			scene.add( this.directionalLight );
	}

	input(action) {
		if(action == "dayNightToggle") {
			if( this.directionalLight.intensity == 0 && this.intensity != 0){
				this.directionalLight.intensity = this.intensity;
			}
			else {
				this.directionalLight.intensity = 0;
			}
		}
	}
}