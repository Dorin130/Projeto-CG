class collisionManager {
	constructor(playerCar, cheerioList, orangesList, butterList) {
		this.car = playerCar;
		this.cheerios = cheerioList;
		this.oranges = orangesList;
		this.butters = butterList;
		this.xLimits = [-405, 405]
		this.zLimits = [-230, 230]
		//this.tears = ["(┳ _ ┳)"];
	}

	checkAllCollisions() {
		this.checkCarOrange();
		this.checkCarButter();
		this.checkCarCheerios();
		this.checkCheerioCheerio();
		this.checkCarInside();
		this.checkCheerioInside();
	}

	checkCarButter() {
		for (var i = 0; i < this.butters.length; i++) {
			if (this.hasCollision(this.car, this.butters[i])) {
				this.car.butterCollision();
			}
		}
	}

	checkCarOrange() {
		for (var i = 0; i < this.oranges.length; i++) {
			if (this.hasCollision(this.car, this.oranges[i])) {
				playerCar.reset();
				pathRandomizer.reset();
			}
		}
	}

	checkCarCheerios() {
		for (var i = 0; i < this.cheerios.length; i++) {
			if (this.hasCollision(this.car, this.cheerios[i])) {
				this.cheerios[i].incomingCollision(this.car.getCollisionResponse(false));
				this.cheerios[i].resolveClipping();
				this.cheerios[i].incomingList = [];
				this.cheerios[i].setFinal();
			}
		}
	}

	checkCarInside() {
		if (!this.isInisde(this.car)) {
			playerCar.reset();
			pathRandomizer.reset();
		}
	}

	checkCheerioCheerio() {
		for (var i = 0; i < this.cheerios.length; i++) {
			for (var j = i + 1; j < this.cheerios.length; j++) {
				if (this.hasCollision(this.cheerios[i], this.cheerios[j])) {
					var final1 = this.cheerios[i].isFinal(); var final2 = this.cheerios[j].isFinal();
					if((final1&&final2) || ((!final1)&&(!final2))) {
						final1 = false
						final2 = !final1;
					}
					var response1 = this.cheerios[j].getCollisionResponse(final1);
					var response2 = this.cheerios[i].getCollisionResponse(final1);
					this.cheerios[i].incomingCollision(response1);
					this.cheerios[j].incomingCollision(response2); 
					if(final1||final2) {
						this.cheerios[i].setFinal();
						this.cheerios[j].setFinal();
					}
				}
			}
		}
	}

	checkCheerioInside() {
		for (var i = 0; i < this.cheerios.length; i++) {
			if (!this.isInisde(this.cheerios[i])) {
				scene.remove(this.cheerios[i].getObject());
			}
		}
	}


	hasCollision(one, two) {
		return Math.pow(one.boundingRadius + two.boundingRadius, 2)-0.1 >=
		one.getTentativePosition().distanceToSquared(two.getTentativePosition());
	}

	isInisde(thing) {
		var pos = thing.getTentativePosition();
		return  pos.x > this.xLimits[0] && pos.x < this.xLimits[1] && pos.z > this.zLimits[0] && pos.z < this.zLimits[1]
	}
}

function removeEntity(object) {
    var selectedObject = scene.getObjectByName(object.name);
    scene.remove( selectedObject );
}