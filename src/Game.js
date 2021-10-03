import { Simulation } from './Simulation.js';
import { TimeAndDate } from './TimeAndDate.js';

class Game {
	constructor(ui) {
		this.ui = ui;
		this.simulation = new Simulation();
		this.gameState = new GameState();
		
		this.ui.startup = this.startGame.bind(this);
	}
	
	startGame() {
		this.ui.showInGameModal(
			"It's gonna be a cold one",
			"As your first important decision as Goobernor this year, your cronies on the energy committee want to know if they should require the power plants to get ready for winter. Experts are warning that it might dip below freezing. Your political donors are warning that you should never trust experts, and that they'll donate more to your reelection campaign if they aren't forced to winterize.", 
			"Prepare? Nah. Money is for politicians, not power plants.", 
			this.skipWinterization.bind(this), 
			"Better safe than sorry. Winterize the power plants.", 
			this.winterize.bind(this)
		);
	}
	
	skipWinterization() {
		this.ui.clearInGameModal();
		this.ui.showInGameModal(
			"Money money money",
			"Your friends who own the power plants send a cool million your way as thanks for the complete lack of regulations.", 
			"Cool! In Tegzit, political donations don't count as bribes.", 
			this.continueGame.bind(this)
		);
	}
	
	winterize() {
		this.ui.clearInGameModal();
		this.ui.showInGameModal(
			"Tsk tsk",
			"\"I thought I could count on the great state of Tegzit to be friendly to my business,\" your friend who owns a power plant tells you. Your reelection campaign is going to have a harder time raising money if you keep this up.", 
			"Oh", 
			this.continueGame.bind(this)
		);
	}
	
	continueGame() {
		// TODO: something
	}
}

class GameState {
	constructor() {
		this.timeAndDate = new TimeAndDate(0, 13);
	}
}

export { Game };