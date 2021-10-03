function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

class Storm {
	constructor() {
		this.length = Math.ceil(Math.random() * 3);
		this.daytimeTemperature = 0;
		this.nighttimeTemperature = 0;
		this.regenerateTemps();
	}
	
	regenerateTemps() {
		this.daytimeTemperature = randomInRange(20, 40);
		this.nighttimeTemperature = Math.min(randomInRange(-2, 40), this.daytimeTemperature);
	}
	
	calculateTemperatureAtHour(hour = 0, dayOfStorm = 0) {
		let distanceFromNoon = Math.abs(12 - hour) / 12;
		let distanceFromMidnight = 1 - distanceFromNoon;
		if (dayOfStorm == 0 && hour < 2) {
			return 45;
		} else if (dayOfStorm < this.length) {
			return distanceFromNoon * this.nighttimeTemperature + 	distanceFromMidnight * this.daytimeTemperature;
		} else {
			return 65;
		}
	}
}

export { Storm };