const SAFE_TEMP = 60; // vaguely based on https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/776497/Min_temp_threshold_for_homes_in_winter.pdf
const PERCENT_DANGER_PER_DEGREE = 0.1;
const POP_PER_GEN = 3; // population protected by a single generator, assume household of 3

const GAZZ_USAGE_PER_HOUR_PER_POP = 0.25;
const GAZZ_USAGE_PER_HOUR_PER_GEN = 0.5;

// energy industry donation amounts sourced from https://www.houstonchronicle.com/opinion/editorials/article/Editorial-We-froze-and-Abbott-got-paid-1-16354431.php
const BASELINE_ENERGY_DONATION = 250000;
const FRIENDLY_ENERGY_DONATION = 1000000;

const DONATION_PER_GEN_SOLD = 10;

const DONATION_PER_GAZZ_BARREL = 100;

import { Donations } from './Donations.js';

class Simulation {
	constructor() {
		this.world = {
			Youstonia: new Subgrid(2304580 * 0.3, 2304580 * 0.7),
			Amalgopolis: new Subgrid(7637387 * 0.5, 7637387 * 0.5),
		}
		this.donations = new Donations();
		this.gridWinterized = false;
	}
	
	getPopulation() {
		let population = 0;
		for (const subgrid in this.world) {
			population += this.world[subgrid].getPopulation();
		}
		return population;
	}
	
	getPopulationInDanger() {
		let popInDanger = { orange: 0, purple: 0, total: 0 };
		for (const subgrid in this.world) {
			const subgridPop = this.world[subgrid].getPopulationInDanger();
			popInDanger.orange += subgridPop.orange;
			popInDanger.purple += subgridPop.purple;
			popInDanger.total += subgridPop.total;
		}
		return popInDanger;
	}
	
	getPoweredPopulation(includeGenerators = true) {
		let isPoweredPopulation = 0;
		for (const subgrid in this.world) {
			if (this.world[subgrid].isPowered) {
				isPoweredPopulation += this.world[subgrid].getPopulation();
			} else if (includeGenerators) {
				isPoweredPopulation += Math.min(this.world[subgrid].generatorCount * POP_PER_GEN, this.world[subgrid].getPopulation());
			}
		}
		return isPoweredPopulation;
	}
	
	getAvgPurpleApprovalRating() {
		let total = 0;
		let totalPop = 0;
		for (const subgrid in this.world) {
			total += this.world[subgrid].purpleCandidateApprovalRating;
			totalPop += this.world[subgrid].getPopulation();
		}
		return total / totalPop;
	}
	
	// returns gazz usage from this hour
	hourTick(outdoorTemperature = 72, orangeGovernorInPower = true) {
		// TODO: set subgrid power status based on power plant capacity?
		
		let gazzUsage = 0;
		for (const subgrid in this.world) {
			gazzUsage += this.world[subgrid].hourTick(outdoorTemperature, orangeGovernorInPower);
		}
		
		return gazzUsage;
	}
	
	// returns count of generators purchased
	buyGenerators() {
		let totalGensBought = 0;
		for (const subgrid in this.world) {
			totalGensBought += this.world[subgrid].buyGenerators();
		}
		return totalGensBought;
	}
}

class Subgrid {
	Constructor(orangePopulation = 0, purplePopulation = 0) {
		this.orangePopulation = Math.round(orangePopulation); // population in this subgrid that leans orange
		this.purplePopulation = Math.round(purplePopulation); // population in this subgrid that leans purple
		this.isPowered = true;
		this.indoorTemperature = 72;
		this.generatorCount = 0;
		this.generatorDemandPop = 0;
		this.purpleCandidateApprovalRating = 0.5;
	}
	
	getPopulation() {
		return this.orangePopulation + this.purplePopulation;
	}
	
	getPopulationInDanger() {
		const popProtectedByGenerators = Math.min(this.getPopulation(), generatorCount * POP_PER_GEN);
		// let susceptiblePopulation = orangePopulation + purplePopulation - popProtectedByGenerators;
		const susceptiblePurple = this.purplePopulation - popProtectedByGenerators / 3; // assume 1/3 of generators are owned by purple
		const susceptibleOrange = this.orangePopulation - popProtectedByGenerators / 3 * 2; // assume 2/3 of generators are owned by orange
		const degreesBelowSafeTemp = SAFE_TEMP - this.indoorTemperature;
		
		if(degreesBelowSafeTemp <= 0) {
			return { purple: 0, orange: 0, total: 0 };
		} else {
			let purpleInDanger = susceptiblePurple * (degreesBelowSafeTemp * PERCENT_DANGER_PER_DEGREE / 100);
			let orangeInDanger = susceptibleOrange * (degreesBelowSafeTemp * PERCENT_DANGER_PER_DEGREE / 100);
			purpleInDanger = Math.floor(purpleInDanger);
			orangeInDanger = Math.floor(orangeInDanger);
			
			return {
				purple: purpleInDanger,
				orange: orangeInDanger,
				total: purpleInDanger + orangeInDanger
			};
		}
	}
	
	// passing of one hour, returns gazz usage in barrels
	hourTick(outdoorTemperature = 72, orangeGovernorInPower = true) {
		// calculate harm to population
		if (!this.isPowered && this.indoorTemperature < SAFE_TEMP) {
			const populationInDanger = this.getPopulationInDanger();
			this.orangePopulation -= populationInDanger.orange;
			this.purplePopulation -= populationInDanger.purple;
		}
		
		// update indoor temp
		if(this.isPowered) {
			this.indoorTemperature += (72 - this.indoorTemperature) / 2;
		} else {
			this.indoorTemperature -= (this.indoorTemperature - outdoorTemperature) / 10;
		}
		
		// update generator demand
		if(!this.isPowered && this.indoorTemperature < SAFE_TEMP) {
			this.generatorDemandPop += this.orangePopulation * 0.01;
		}
		
		// if there are more generators than people, reduce generators
		if( this.generatorCount > this.getPopulation() ) {
			this.generatorCount = this.getPopulation();
		}
		
		// update approval rating
		const tempBelow72 = 72 - this.indoorTemperature;
		const discomfort = Math.min(30, tempBelow72) / 30;
		if (orangeGovernorInPower) {
			// if the current governor is orange, purple will approve more highly of the purple candidate if the temp is uncomfortable
			const possibleApprovalChange = 0.1;
			this.purpleCandidateApprovalRating += possibleApprovalChange * discomfort;
		} else {
			// if the current governor is purple, purple will approve less highly of their own governor if the temp is uncomfortable
			const possibleApprovalChange = 0.05;
			this.purpleCandidateApprovalRating -= possibleApprovalChange * discomfort;
		}
		
		// calculate gazz usage
		let gazzUsage = 0;
		if (this.powered) {
			gazzUsage = GAZZ_USAGE_PER_HOUR_PER_POP * this.getPopulation();
		} else {
			const generatorGazzUsage = this.generatorCount * GAZZ_USAGE_PER_HOUR_PER_GEN;
			const generatorPopGazzUsage = this.generatorCount * POP_PER_GEN * GAZZ_USAGE_PER_HOUR_PER_POP;
			gazzUsage = generatorGazzUsage + generatorPopGazzUsage;
		}
		return gazzUsage;
	}
	
	buyGenerators() {
		const generatorsPurchased = this.generatorDemandPop;
		this.generatorCount += generatorsPurchased;
		this.generatorDemandPop = 0; // reset demand
		
		// if there are more generators than people, reduce generators
		if( this.generatorCount > this.getPopulation() ) {
			this.generatorCount = this.getPopulation();
		}
		
		return generatorsPurchased;
	}
}

export { Simulation, Subgrid };