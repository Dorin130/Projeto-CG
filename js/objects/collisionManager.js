class collisionManager {
	constructor(playerCar, cheerioList, orangesList, butterList) {
		this.car = playerCar;
		this.cheerios = cheerioList;
		this.oranges = orangesList;
		this.butters = butterList;
		this.tears = [];
		console.log(this.butters);
	}

	checkAllCollisions() {
		//this.checkCarOrange();
		this.checkCarButter();
		this.checkCarCheerios();
		this.checkCheerioCheerio();
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
				resetGame();
			}
		}
	}

	checkCarCheerios() {
		for (var i = 0; i < this.cheerios.length; i++) {
			if (this.hasCollision(this.car, this.cheerios[i])) {
				this.cheerios[i].incomingCollision(this.car.getCollisionResponse(true));
			}
		}
	}

	checkCheerioCheerio() {
		for (var i = 0; i < this.cheerios.length; i++) {
			for (var j = i + 1; j < this.cheerios.length; j++) {
				if (this.hasCollision(this.cheerios[i], this.cheerios[j])) {
					this.cheerios[i].incomingCollision(this.cheerios[j].getCollisionResponse(true));
					this.cheerios[j].incomingCollision(this.cheerios[i].getCollisionResponse(true));
				}
			}
		}
	}


	hasCollision(one, two) {
		return Math.pow(one.boundingRadius + two.boundingRadius, 2) >=
		one.getTentativePosition().distanceToSquared(two.getTentativePosition());
	}
}