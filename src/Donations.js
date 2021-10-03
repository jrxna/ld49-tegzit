// energy industry donation amounts sourced from https://www.houstonchronicle.com/opinion/editorials/article/Editorial-We-froze-and-Abbott-got-paid-1-16354431.php
const BASELINE_ENERGY_DONATION = 250000;
const FRIENDLY_ENERGY_DONATION = 1000000;

const DONATION_PER_GEN_SOLD = 10;

const DONATION_PER_GAZZ_BARREL = 100;

const GRASSROOTS_DONATION_MAX_PER_POP = 1;

class Donations {
	constructor() {
		this.gazzIndustryDonations = 0;
		this.energyIndustryDonations = 0;
		this.generatorIndustryDonations = 0;
		this.purpleCampaignGrassrootsDonations = 0;
	}
	
	getOrangeDonations() {
		return this.gazzIndustryDonations + this.energyIndustryDonations + this.generatorIndustryDonations;
	}
	
	getPurpleDonations() {
		return this.purpleCampaignGrassrootsDonations;
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
	
	applyPurpleGrassrootsDonations(purplePopulation = 0, averageApprovalRating = 0.5) {
		const newPurpleDonationsValue = purplePopulation * GRASSROOTS_DONATION_MAX_PER_POP * averageApprovalRating;
		this.purpleCampaignGrassrootsDonations = Math.max(this.purpleCampaignGrassrootsDonations, newPurpleDonationsValue); // donations can't be less than they already are!
	}
	
	resetAllDonations() {
		this.gazzIndustryDonations = 0;
		this.energyIndustryDonations = 0;
		this.generatorIndustryDonations = 0;
		this.purpleCampaignGrassrootsDonations = 0;
	}
}

export { Donations };