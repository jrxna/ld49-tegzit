import { Simulation } from './Simulation.js';

class Game {
	constructor(ui) {
		this.ui = ui;
		this.simulation = new Simulation();
	}
}

export { Game };