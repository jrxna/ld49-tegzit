function randomInRange(min, max) {
	return Math.random() * (max - min) + min;
}

class Storm {
	constructor() {
		this.length = Math.floor(Math.random() * 5);
		this.daytimeTemperature = 0;
		this.nighttimeTemperature = 0;
		this.regenerateTemps();
	}
	
	regenerateTemps() {
		this.daytimeTemperature = randomInRange(20, 40);
		this.nighttimeTemperature = Math.min(randomInRange(-2, 40), this.daytimeTemperature);
	}
	
	calculateTemperatureAtHour(hour = 0) {
		let distanceFromNoon = Math.abs(12 - hour) / 12;
		let distanceFromMidnight = 1 - distanceFromNoon;
		return distanceFromNoon * this.nighttimeTemperature + distanceFromMidnight * this.daytimeTemperature;
	}
}

export { Storm };