let SAFE_TEMP = 60; // vaguely based on https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/776497/Min_temp_threshold_for_homes_in_winter.pdf
let PERCENT_DANGER_PER_DEGREE = 0.1;

class Simulation {
	constructor() {
		this.world = {
			Youstonia: new Subgrid(2304580 * 0.3, 2304580 * 0.7),
			Amalgopolis: new Subgrid(7637387 * 0.5, 7637387 * 0.5),
		}
	}
	
	getPopulation() {
		let population = 0;
		for (const subgrid in this.world) {
			population += subgrid.getPopulation();
		}
		return population;
	}
	
	getPopulationInDanger() {
		let popInDanger = { orange: 0, purple: 0, total: 0 };
		for (const subgrid in this.world) {
			const subgridPop = subgrid.getPopulationInDanger();
			popInDanger.orange += subgridPop.orange;
			popInDanger.purple += subgridPop.purple;
			popInDanger.total += subgridPop.total;
		}
		return popInDanger;
	}
	
	getPoweredPopulation() {
		let isPoweredPopulation = 0;
		for (const subgrid in this.world) {
			if (subgrid.isPowered) {
				isPoweredPopulation += subgrid.getPopulation();
			}
		}
		return isPoweredPopulation;
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
	}
	
	getPopulation() {
		return this.orangePopulation + this.purplePopulation;
	}
	
	getPopulationInDanger() {
		const popProtectedByGenerators = Math.max(this.getPopulation(), generatorCount * 3); // assume avg household size
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
	
	// passing of one hour
	hourTick(outdoorTemperature = 72) {
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
			this.indoorTemperature -= (this.indoorTemperature - outdoorTemperature) / 4;
		}
		
		// update generator demand
		if(!this.isPowered && this.indoorTemperature < SAFE_TEMP) {
			this.generatorDemandPop += this.orangePopulation * 0.01;
		}
		
		// if there are more generators than people, reduce generators
		if( this.generatorCount > this.getPopulation() ) {
			this.generatorCount = this.getPopulation();
		}
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