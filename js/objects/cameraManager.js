/* custom Camera manager */
'use strict'
class cameraManager {
	constructor(customCamera, switchKey) {
		this.cameraList = [];
		this.currentCamera = customCamera;
		this.addCamera(customCamera, switchKey);
	}

	addCamera(customCamera, switchKey) {
		this.cameraList[String(switchKey)] = customCamera;
	}

	update(delta_t) {
		this.currentCamera.update(delta_t);
	}
	
	input(action) {
		if(action in this.cameraList) {
			this.currentCamera = this.cameraList[action];
		} else {
			this.currentCamera.input(action);
		}
	}

	getCurrentCam() {
		return this.currentCamera.getCamera();
	}

	getCamera(switchKey) {
		return this.cameraList[String(switchKey)];
	}

}