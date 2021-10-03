import { Simulation } from './Simulation.js';

class Game {
	constructor(ui) {
		this.ui = ui;
		this.simulation = new Simulation();
		this.gameState = new GameState();
	}
}

class GameState {
	constructor() {
		this.year = 0;
		
	}
}

export { Game };