/* Camera related functions and classes */
class customCamera {
	constructor(camera, LookAtPos) {
		this.camera = camera;
		this.camera.lookAt(LookAtPos);
		this.cameraStart = camera.position.clone();
		this.lookAtAddedVector = new THREE.Vector3(0, 0, 0);
		this.lookAtObj = undefined;
		this.followObject = undefined;
		this.rotateWithObject = undefined;
		this.thetaRotateFreq = 0;
		this.phiRotateFreq = 0;
		this.transRadius = 0;
		this.transPhi = 0;
		this.transTheta = 0;
		this.wrapAroundPhi = false;
		this.windowResize = false;

		//Manual control
		this.controled = false;
		this.scrollSpeed = 5;
			//Inputs
		this.upScroll = 0;

		//aspect ratio
		this.minWindowSize = undefined;
	}

	getCamera() {
		return this.camera;
	}

	follow(obj, rotateWith) {
		this.followObject = obj;
		this.followObject.updateMatrixWorld();
		this.objectStart = obj.position.clone();
		this.camera.position.set(obj.position.clone());
		this.cameraStart = obj.position.clone();
		if(rotateWith) {
			this.transRadius = 5;
			this.transPhi = Math.PI/4;
			this.rotateWithObject = obj;
		}
	}

	focusOn(obj, addedVector) {
		this.lookAtObj = obj;
		if(addedVector != undefined) {
			this.lookAtAddedVector = addedVector;
		}
		if(this.lookAtObj != undefined) {
			this.lookAtObj.updateMatrixWorld();
			this.camera.lookAt(this.lookAtAddedVector.clone().add(this.lookAtObj.getWorldPosition()));
		}
	}

	prepareWindowResize(minWidth=0, minHeight=0) {
		this.windowResize = true;
		this.minWindowSize = [minWidth, minHeight];
		if(minHeight == 0 || minWidth == 0)
			this.minWindowSize = undefined;
	}

	manualControl() {
		this.controled = true;
		/* add manual control */
	}

	scrollUp() {
		this.upScroll += this.scrollSpeed;
	}

	scrollDown() {
		this.upScroll -= this.scrollSpeed;
	}

	//internal functions

	update(delta_time) {
		if(this.windowResize) this.updateWindowResize();
		this.updateCameraPosition(delta_time);
		this.updateCameraOrientation();
		if(this.controled) this.checkControlerEvents(delta_time);
	}

	updateCameraPosition(delta_time) {
		var pos = this.cameraStart.clone();
		if(this.followObject != undefined) {
			this.followObject.updateMatrixWorld();
			pos.add(this.followObject.getWorldPosition().clone().sub(this.objectStart));
			console.log(pos);
		}
		this.camera.position.set(pos.getComponent(0), pos.getComponent(1), pos.getComponent(2));
		
		this.updateTransform(delta_time);
	}

	updateTransform(delta_time) {
		var theta, phi;
		if(this.rotateWithObject == undefined) {
			this.transPhi += (this.phiRotateFreq * delta_time);
			phi = this.transPhi;
			this.transTheta += this.thetaRotateFreq * delta_time;
			theta = this.transTheta;
		} else {
			if(this.rotateWithObject.getWorldRotation().x/2 == 0)
				theta = -this.rotateWithObject.getWorldRotation().y
			else 
				theta = this.rotateWithObject.getWorldRotation().y-Math.PI;
			phi = this.transPhi;
		}
		if(this.wrapAroundPhi) {
			this.transPhi %= Math.PI;
		}
		var transVec = new THREE.Vector3(Math.cos(theta)*Math.sin(phi%Math.PI), Math.cos(phi), 
										 Math.sin(theta)*Math.sin(phi%Math.PI))
		transVec.multiplyScalar(this.transRadius);

		this.camera.position.add(transVec);
		//console.log(transVec);
	}

	setTransform(radius, phiRate, thetaRate, phiStart, thetaStart, wrapAroundPhi) {
		this.transRadius = radius;
		this.phiRotateFreq = phiRate;
		this.thetaRotateFreq = thetaRate;
		if(wrapAroundPhi != undefined) this.wrapAroundPhi = wrapAroundPhi;
		if(phiStart != undefined) this.transPhi = phiStart;
		if(thetaStart != undefined) this.transTheta = thetaStart;
	}

	updateCameraOrientation() {
		if(this.lookAtObj != undefined) {
			this.lookAtObj.updateMatrixWorld();
			//this.camera.up = new THREE.Vector3(0,0,1);
			this.camera.lookAt(this.lookAtAddedVector.clone().add(this.lookAtObj.getWorldPosition()));
		} else {
			this.camera.lookAt(this.lookAtAddedVector);
		}
	}

	updateWindowResize() {
		if(this.camera.isOrthographicCamera) {
			var asp = (window.innerWidth / window.innerHeight);
			if (this.minWindowSize != undefined && asp < this.minWindowSize[0]/this.minWindowSize[1]) {
				var view = this.camera.top-this.camera.bottom;
				this.camera.left = (view*asp / - 2);
				this.camera.right = (view*asp / 2);
			} else {
				var view = this.camera.right-this.camera.right;
				this.camera.top = (view/asp / 2);
				this.camera.bottom = (view/asp / -2);
			}
		} else {
	    	this.camera.aspect = window.innerWidth / window.innerHeight;
		}

	    this.camera.updateProjectionMatrix();
	}

	checkControlerEvents(delta_time) {
		if(this.transRadius!=0) {
			this.scrollCheck(delta_time);
		}
	}

	scrollCheck(delta_time) {
		var change_time = 0.1; // multiplicative factor
		if(this.upScroll > 0.2) {
			this.transRadius = Math.max(0.1, this.transRadius-this.upScroll*delta_time/change_time);
			this.upScroll = Math.max(0, this.upScroll-this.upScroll*delta_time/change_time);
		} else if (this.upScroll < -0.2) {
			this.transRadius = Math.max(0.1, this.transRadius-this.upScroll*delta_time/change_time);
			this.upScroll = Math.min(0, this.upScroll-this.upScroll*delta_time/change_time);
		} else if (this.upScroll != 0) {
			this.transRadius = Math.max(0.1, this.transRadius-this.upScroll);
			this.upScroll = 0;
		}
	}
}



/*
		//deprecated but funny
		var smoothFactor = 15; // distance at which 1 physical scroll = 1 unit of radius
		if(this.upScroll > 0) {
			console.log(this.scrollSpeed);
			this.upScroll = Math.max(0, this.upScroll-this.scrollSpeed);
			this.transRadius = Math.max(0.1, this.transRadius-this.scrollSpeed);
		} else if (this.upScroll < 0) {
			console.log(this.scrollSpeed);
			this.upScroll = Math.min(0, this.upScroll+this.scrollSpeed);
			this.transRadius = Math.max(0.1, this.transRadius+this.scrollSpeed);
		}
		this.scrollSpeed = this.transRadius/smoothFactor;
*/