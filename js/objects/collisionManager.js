class collisionManager {
	constructor(playerCar, cheerioList, orangesList, butterList) {
		this.car = playerCar;
		this.cheerios = cheerioList;
		this.oranges = orangesList;
		this.butters = butterList;
		this.tears = [];
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
				this.cheerios[i].incomingCollision(this.car.getCollisionResponse(false));
				this.cheerios[i].resolveClipping();
				this.cheerios[i].incomingList = [];
				this.cheerios[i].setFinal();
			}
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


	hasCollision(one, two) {
		return Math.pow(one.boundingRadius + two.boundingRadius, 2)-0.1 >=
		one.getTentativePosition().distanceToSquared(two.getTentativePosition());
	}
}