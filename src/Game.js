import { Simulation } from './Simulation.js';
import { TimeAndDate } from './TimeAndDate.js';

class Game {
	constructor(ui) {
		this.ui = ui;
		this.simulation = new Simulation();
		this.gameState = new GameState();
		
		this.orangeGovernor = true; // TODO: make this dynamic or something
		
		this.ui.startup = this.startGame.bind(this);
	}
	
	startGame() {
		this.updateUI();
		this.ui.showInGameModal(
			"🌨 It's gonna be a cold one",
			"As your first important decision as Goobernor this year, your cronies on the energy committee want to know if they should require the power plants to get ready for the winter storm that's coming in. Experts are warning that it might dip below freezing. Your political donors are warning that you should never trust experts, and that they'll donate more to your reelection campaign if they aren't forced to winterize.", 
			"Prepare? Nah. Money is for politicians, not power plants.", 
			this.skipWinterization.bind(this), 
			"Better safe than sorry. Winterize the power plants.", 
			this.winterize.bind(this)
		);
	}
	
	skipWinterization() {
		this.simulation.gridWinterized = false;
		this.simulation.donations.applyEnergyDonations(false, this.orangeGovernor);
		this.ui.clearInGameModal();
		this.ui.showInGameModal(
			"💰 Money money money",
			"Your friends who own the power plants send a cool million your way as thanks for the complete lack of regulations.", 
			"Cool! In Tegzit, political donations don't count as bribes.", 
			this.continueGame.bind(this)
		);
	}
	
	winterize() {
		this.simulation.gridWinterized = true;
		this.simulation.donations.applyEnergyDonations(true, this.orangeGovernor);
		this.ui.clearInGameModal();
		this.ui.showInGameModal(
			"💸 Tsk tsk",
			"\"I thought I could count on the great state of Tegzit to be friendly to my business,\" your friend who owns a power plant tells you. Your reelection campaign is going to have a harder time raising money if you keep this up.", 
			"Oh", 
			this.continueGame.bind(this)
		);
	}
	
	continueGame() {
		// TODO: something
		this.ui.clearInGameModal();
		this.updateUI();
	}
	
	updateUI() {
		this.ui.outputs.orangeFunds.textContent = this.simulation.donations.getOrangeDonations();
		this.ui.outputs.purpleFunds.textContent = this.simulation.donations.getPurpleDonations();
		this.ui.outputs.date.textContent = this.gameState.timeAndDate.getFriendlyString();
		// TODO: set temperature field
		// TODO: grid stability
		// TODO (somewhere): gazz usage
		// TODO somewhere else: generator demand
		this.ui.outputs.genCount.textContent = this.simulation.getGenCount();
		this.ui.outputs.gazzIndustryDonations.textContent = this.simulation.donations.gazzIndustryDonations;
		this.ui.outputs.generatorIndustryDonations.textContent = this.simulation.donations.generatorIndustryDonations;
		this.ui.outputs.energyIndustryDonations.textContent = this.simulation.donations.energyIndustryDonations;
		this.ui.outputs.populationFields.forEach(function(field) {
			field.textContent = this.simulation.getPopulation();
		}.bind(this));
		this.ui.outputs.popApproval.textContent = this.simulation.getAvgPurpleApprovalRating();
		this.ui.outputs.popInDanger.textContent = this.simulation.getPopulationInDanger();
		// TODO: the percent change figures
	}
}

class GameState {
	constructor() {
		this.timeAndDate = new TimeAndDate(0, 13);
	}
}

export { Game };