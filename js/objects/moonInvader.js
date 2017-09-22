/* Moon invader (OO -> do it like this in the future) */
class moonInvader {
	constructor(PosX, PosY, PosZ, sphereRadius) {
		this.moon = new THREE.Object3D();
		var geometry = new THREE.SphereGeometry(sphereRadius, 32, 32);
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		
		var sphere = new THREE.Mesh( geometry, material );
		this.moon.add(sphere);
		this.ring = new ringOfCones(this.moon, 4, 10, 18, Math.PI/4, Math.PI/2, Math.PI/4);

		scene.add(this.moon);
		this.moon.position.set(PosX, PosY, PosZ);
	}

	ringSet(number, minRadius, maxRadius, theta, radialFreq, rotateFreq) {
		this.ring.set(number, minRadius, maxRadius, theta, radialFreq, rotateFreq);
	}

	update(delta_time) {
		this.ring.update(delta_time);
	}

	remove() {
		this.ring.remove();
		for (var i = this.moon.children.length - 1; i >= 0; i--) {
    		this.moon.remove(this.moon.children[i]);
		}
		scene.remove(this.moon);
	}

	getObject() {
		return this.moon;
	}

	getCone(i) {
		return this.ring.getCone(i);
	}
}

class ringOfCones {
	constructor(object, number, minRadius, maxRadius, theta, radialFreq, rotateFreq) {
		
		this.number = number;
		this.object = object;
		this.cones = [];
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		//var geometry = new THREE.SphereGeometry(2, 36, 36);
		var geometry = new THREE.ConeGeometry(2, 5, 32);

		for(var i=0; i<number; i++) { this.cones.push( new THREE.Mesh( geometry, material ) ); }

		this.set(number, minRadius, maxRadius, theta, radialFreq, rotateFreq);

		for(var i=0; i<number; i++) { object.add(this.cones[i]); }
	}

	update(delta_time) {
		this.theta += delta_time*this.rotateFreq;//*2*Math.PI;
		this.radiusTheta += delta_time*this.radialFreq;
		var radius = this.radiusAverage + this.radiusDelta*Math.sin(this.radiusTheta);
		for(var i=0; i<this.number; i++) {
			var specificTheta = this.theta+i*(2*Math.PI/this.number);
			this.cones[i].position.set(radius*Math.cos(specificTheta), radius*Math.sin(specificTheta), 0);
			this.cones[i].rotation.z += delta_time*this.rotateFreq;
		}
	}

	set(number, minRadius, maxRadius, theta, radialFreq, rotateFreq) {
		
		var material = new THREE.MeshBasicMaterial( {color: 0xff0000} );
		var geometry = new THREE.ConeGeometry(2, 5, 32);

		if(this.number < number) {
			for(var i=this.number; i < number; i++) {
				var newCone = new THREE.Mesh( geometry, material )
				this.cones.push( newCone );
				this.object.add( newCone );
				//scene.add( newCone );//check if necessary
			}
		} else if (this.number > number) {
			for(var i=number; i < this.number; i++) { 
				var extraCone = this.cones.pop();
				scene.remove(extraCone);
				extraCone.geometry.dispose();
				extraCone.material.dispose();
				extraCone.parent.remove(extraCone);
				extraCone = undefined;
			}
		}

		this.number = number;
		this.radiusAverage = (minRadius+maxRadius)/2;
		this.radiusDelta = (maxRadius-minRadius)/2;
		this.radiusTheta = 0;
		this.theta = theta;
		this.radialFreq = radialFreq;
		this.rotateFreq = rotateFreq;

		//var geometry = new THREE.SphereGeometry(2, 36, 36);
		var interval = 2*Math.PI/number;

		//this.cones[0].material = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
		//this.cones[this.number-1].material = new THREE.MeshBasicMaterial( {color: 0x0000ff} );

		for(var i=0; i<this.number; i++) {
			this.cones[i].position.set(minRadius*Math.cos(theta), minRadius*Math.sin(theta), 0);
			this.cones[i].rotation.z = theta-(1/2)*Math.PI;
			theta += interval;
		}
	}

	remove() {
		this.set(0, 0, 0, 0, 0, 0);
		this.cones = undefined;
	}

	getCone(i) {
		return this.cones[i];
	}
}
/* end of Moon Invader */
