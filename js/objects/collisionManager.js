class collisionManager {
	constructor(playerCar, cheerioList, orangesList, butterList) {
		this.car = playerCar;
		this.cheerios = cheerioList;
		this.oranges = orangesList;
		this.butters = butterList;
		this.tears = [];
	}

	checkAllCollisions() {
		this.checkCheerioCheerio();
	}

	checkCheerioCheerio() {
		for (var i = 0; i < this.cheerios.length; i++) {
			for (var j = i + 1; j < this.cheerios.length; j++) {
				if (this.hasCollision(this.cheerios[i], this.cheerios[j])) {
					this.cheerios[i].incomingCollision(this.cheerios[j].getCollisionResponse(false));
					this.cheerios[j].incomingCollision(this.cheerios[i].getCollisionResponse(true));
				}
			}
		}
	}
	checkCarCheerio() {
		for (var i = 0; i < this.cheerios.length; i++) {
			this.cheerios[i].incomingCollision(this.car.getCollisionResponse());
		}
	}

	hasCollision(one, two) {
		return Math.pow(one.boundingRadius + two.boundingRadius, 2) >= one.getPosition().distanceToSquared(two.getPosition())
	}

/*

	CarCheerioCollision(car, radius) {
		var carPos = car.getWorldPosition();
		carPos.y = 0
		for (var i = this.cheerios.length - 1; i >= 0; i--) {
			var cheerioPos = this.cheerios[i][0].getWorldPosition();
			cheerioPos.y=0
			var test = Math.pow(this.cheerios[i][1] + radius, 2) - carPos.distanceToSquared(cheerioPos)
			if (test > 0) {
				cheerioPos.sub(carPos);
				cheerioPos.normalize();
				cheerioPos.multiplyScalar(this.cheerios[i][1] + radius- carPos.distanceTo(this.cheerios[i][0].getWorldPosition()))

				this.cheerios[i][0].position.add(cheerioPos);
				this.CheerioCheerioCollision(this.cheerios[i][0], this.cheerios[i][1])

			}
		}
	}

	CheerioCheerioCollision(cheerio, radius) {





		var cheerio1Pos = cheerio.getWorldPosition();
		cheerio1Pos.y = 0;
		for (var i = this.cheerios.length - 1; i >= 0; i--) {
			var cheerio2Pos = this.cheerios[i][0].getWorldPosition();
			cheerio2Pos.y=0
			var distance = cheerio1Pos.distanceToSquared(cheerio2Pos);
			var test = Math.pow(this.cheerios[i][1] + radius, 2) - distance
			if (distance != 0 && test > 0) {

				cheerio2Pos.sub(cheerio1Pos);
				cheerio2Pos.normalize();
				cheerio2Pos.multiplyScalar(Math.sqrt(this.cheerios[i][1] + radius - cheerio1Pos.distanceTo(this.cheerios[i][0].getWorldPosition())));

				this.cheerios[i][0].position.add(cheerio2Pos);

				this.CheerioCheerioCollision(this.cheerios[i][0], this.cheerios[i][1])
			}
		}
	}*/
}