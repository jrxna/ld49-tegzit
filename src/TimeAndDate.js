class TimeAndDate {
	constructor(year = 0, day = 0, hour = 0, minute = 0) {
		this.year = year;
		this.day = day;
		this.stormStartDay = day;
		this.hour = hour;
		this.minute = minute;
	}
	
	advanceHour() {
		this.minute = 0;
		this.hour += 1;
		if (this.hour >= 24) {
			this.day += 1;
			this.hour = 0;
		}
	}
	
	advanceYear() {
		this.year += 1;
		this.day = Math.floor(Math.random() * 20);
		this.stormStartDay = this.day;
		this.hour = 0;
		this.minute = 0;
	}
	
	getFriendlyHour() {
		if (this.hour > 12) {
			return this.hour - 12;
		} else if (this.hour == 0) {
			return 12;
		} else {
			return this.hour;
		}
	}
	
	getFriendlyMinute() {
		let minuteString = new String(this.minute);
		return minuteString.padStart(2, "0");
	}
	
	getAmPm() {
		if (this.hour > 12) {
			return "PM";
		} else {
			return "AM";
		}
	}
	
	getFriendlyString() {
		return `Ferbry ${this.day}, Year ${this.year + 1} ${this.getFriendlyHour()}:${this.getFriendlyMinute()} ${this.getAmPm()}`
	}
}

export { TimeAndDate };