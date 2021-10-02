class Donations {
	constructor() {
		this.gazzIndustryDonations = 0;
		this.energyIndustryDonations = 0;
		this.generatorIndustryDonations = 0;
	}
	
	// returns added amount
	applyEnergyDonations(winterized = false, governorIsOrange = true) {
		let amountToAdd = 0;
		if (governorIsOrange) {
			if (winterized) {
				amountToAdd = BASELINE_ENERGY_DONATION;
			} else {
				amountToAdd = FRIENDLY_ENERGY_DONATION;
			}
		} else {
			if (winterized) {
				amountToAdd = FRIENDLY_ENERGY_DONATION;
			} else {
				amountToAdd = BASELINE_ENERGY_DONATION;
			}
		}
		this.energyIndustryDonations += amountToAdd;
		return amountToAdd;
	}
	
	// returns added amount
	applyGeneratorDonations(salesCount, governorIsOrange = true) {
		let amountToAdd = DONATION_PER_GEN_SOLD * salesCount;
		
		if(!governorIsOrange) {
			// if generators are sold under a purple governor, the industry will only donate half as much of their profits to the orange party
			amountToAdd = amountToAdd / 2;
		}
		
		this.generatorIndustryDonations += amountToAdd;
		return amountToAdd;
	}
	
	// returns added amount
	applyGazzDonations(gazzUsage, governorIsOrange = true) {
		let amountToAdd = DONATION_PER_GAZZ_BARREL * gazzUsage;
		
		if(!governorIsOrange) {
			amountToAdd = amountToAdd / 2;
		}
		
		this.gazzIndustryDonations += amountToAdd;
		return amountToAdd;
	}
	
	resetAllDonations() {
		this.gazzIndustryDonations = 0;
		this.energyIndustryDonations = 0;
		this.generatorIndustryDonations = 0;
	}
}

export { Donations };