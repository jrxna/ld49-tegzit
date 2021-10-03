import { Simulation } from './Simulation.js';
import { TimeAndDate } from './TimeAndDate.js';

class Game {
	constructor(ui) {
		this.ui = ui;
		this.simulation = new Simulation();
		this.gameState = new GameState();
	}
}

class GameState {
	constructor() {
		this.timeAndDate = new TimeAndDate(0, 13);
	}
	
	
}

export { Game };