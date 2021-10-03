const SAFE_TEMP = 50; // vaguely based on https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/776497/Min_temp_threshold_for_homes_in_winter.pdf
const COMFORTABLE_TEMP = 60;
const PERCENT_DANGER_PER_DEGREE = 0.1;
const POP_PER_GEN = 3; // population protected by a single generator, assume household of 3

const GAZZ_USAGE_PER_HOUR_PER_POP = 0.025;
const GAZZ_USAGE_PER_HOUR_PER_GEN = 0.5;

import { Donations } from './Donations.js';

class Simulation {
	constructor() {
		this.world = {
			Youstonia: new Subgrid(2304580 * 0.3, 2304580 * 0.7),
			Amalgopolis: new Subgrid(7637388 * 0.5, 7637388 * 0.5),
			Horn: new Subgrid(18371, 11212),
			EHorn: new Subgrid(3178,2371),
			Hammertown: new Subgrid(12837, 8193),
			Step: new Subgrid(8912, 1038),
			Face: new Subgrid(12392, 7432),
			Pritchel: new Subgrid(19328, 12739),
			Hardie: new Subgrid(21378, 27984),
			Bull: new Subgrid(2137911, 1923771),
			Chica: new Subgrid(3723, 3719),
			Bayshore: new Subgrid(237189, 273198),
			Arlen: new Subgrid(92831, 32798),
			Cuprite: new Subgrid(23789, 12379),
			Santo: new Subgrid(243789, 78231),
			Haustin: new Subgrid(1738291, 2382178),
			Duro: new Subgrid(237129, 128722),
			Karensville: new Subgrid(2137891, 982388),
			Skillet: new Subgrid(23171,12879),
			Fort: new Subgrid(2137981, 1239787),
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
	
	getPurplePopulation() {
		let population = 0;
		for (const subgrid in this.world) {
			population += this.world[subgrid].purplePopulation;
		}
		return population;
	}
	
	getGenCount() {
		let count = 0;
		for (const subgrid in this.world) {
			count += this.world[subgrid].generatorCount;
		}
		return count;
	}
	
	getGenDemandPop() {
		let pop = 0;
		for (const subgrid in this.world) {
			pop += this.world[subgrid].generatorDemandPop;
		}
		return pop;
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
			const purplePop = this.world[subgrid].purplePopulation;
			total += this.world[subgrid].purpleCandidateApprovalRating * purplePop;
			totalPop += purplePop;
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
		totalGensBought = Math.round(totalGensBought);
		return totalGensBought;
	}
}

class Subgrid {
	constructor(orangePopulation = 0, purplePopulation = 0) {
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
		const popProtectedByGenerators = Math.min(this.getPopulation(), this.generatorCount * POP_PER_GEN);
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
		if(!this.isPowered && this.indoorTemperature < COMFORTABLE_TEMP) {
			this.generatorDemandPop += Math.ceil(this.orangePopulation * 0.01);
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
		if (this.purpleCandidateApprovalRating > 1) {
			this.purpleCandidateApprovalRating = 1;
		} else if (this.purpleCandidateApprovalRating < 0) {
			this.purpleCandidateApprovalRating = 0;
		}
		
		// calculate gazz usage
		let gazzUsage = 0;
		if (this.isPowered) {
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