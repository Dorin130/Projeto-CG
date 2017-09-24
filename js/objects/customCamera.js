/* Camera related functions and classes */
class customCamera {
	constructor(camera, LookAtPos) {
		this.camera = camera;
		this.camera.lookAt(LookAtPos);
		this.cameraStart = camera.position.clone();
		this.lookAtAddedVector = new THREE.Vector3(0, 0, 0);
		this.lookAtObj = undefined;
		this.followObject = undefined;
		this.thetaRotateFreq = 0;
		this.phiRotateFreq = 0;
		this.transRadius = 0;
		this.transPhi = 0;
		this.transTheta = 0;
		this.wrapAroundPhi = false;
		this.windowResize = false;
		this.controled = false;
		this.upScroll = 0;
		this.scrollSmoothness = 1;
	}

	getCamera() {
		return this.camera;
	}

	follow(obj) {
		this.followObject = obj;
		this.followObject.updateMatrixWorld();
		this.objectStart = obj.position.clone();
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

	prepareWindowResize() {
		this.windowResize = true;
	}

	manualControl() {
		this.controled = true;
		/* add manual control */
	}

	scrollUp() {
		this.upScroll += this.scrollSmoothness;
	}

	scrollDown() {
		this.upScroll -= this.scrollSmoothness;
	}

	//internal functions

	update(delta_time) {
		if(this.windowResize) this.updateWindowResize();
		this.updateCameraPosition(delta_time);
		this.updateCameraOrientation();
		if(this.controled) this.checkControlerEvents();
	}

	updateCameraPosition(delta_time) {
		var pos = this.cameraStart.clone();
		if(this.followObject != undefined) {
			this.followObject.updateMatrixWorld();
			pos.add(this.followObject.getWorldPosition().clone().sub(this.objectStart));
		}
		this.camera.position.set(pos.getComponent(0), pos.getComponent(1), pos.getComponent(2));

		this.updateTransform(delta_time);
	}

	updateTransform(delta_time) {
		this.transPhi += (this.phiRotateFreq * delta_time);
		this.transTheta += this.thetaRotateFreq * delta_time;
		if(this.wrapAroundPhi) {
			this.transPhi %= Math.PI;
		}
		var transVec = new THREE.Vector3(Math.cos(this.transTheta)*Math.sin(this.transPhi%Math.PI), Math.cos(this.transPhi), 
										 Math.sin(this.transTheta)*Math.sin(this.transPhi%Math.PI))
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
			var view = this.camera.top-this.camera.bottom;
			this.camera.left = (view*asp / - 2);
			this.camera.right = (view*asp / 2);
		} else {
	    	this.camera.aspect = window.innerWidth / window.innerHeight;
		}

	    this.camera.updateProjectionMatrix();
	}

	checkControlerEvents() {
		if(this.transRadius!=0) {
			this.scrollCheck(true);
		}
	}

	scrollCheck(relative) {
		if(!relative) {
			var scrollSpeed = 1; // multiplicatve factor
			if(this.upScroll > 0) {
				this.upScroll = Math.max(0, this.upScroll-0.2);
				this.transRadius = Math.max(0.1, this.transRadius-0.2*scrollSpeed);
			} else if (this.upScroll < 0) {
				this.upScroll = Math.min(0, this.upScroll+0.2);
				this.transRadius = Math.max(0.1, this.transRadius+0.2*scrollSpeed);
			}
		} else {
			var smoothFactor = 30; // distance at which 1 physical scroll = 1 unit of radius
			if(this.upScroll > 0) {
				console.log(this.scrollSmoothness);
				this.upScroll = Math.max(0, this.upScroll-0.5*this.scrollSmoothness);
				this.transRadius = Math.max(0.1, this.transRadius-0.5*this.scrollSmoothness);
			} else if (this.upScroll < 0) {
				console.log(this.scrollSmoothness);
				this.upScroll = Math.min(0, this.upScroll+0.5*this.scrollSmoothness);
				this.transRadius = Math.max(0.1, this.transRadius+0.5*this.scrollSmoothness);
			}
			this.scrollSmoothness = this.transRadius/smoothFactor;
		}
	}
}

/*
*/