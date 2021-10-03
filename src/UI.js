class UI {
	constructor() {
		this.elements = {
			contentWarning: document.querySelector('.contentWarning'),
			acceptContentWarning: document.querySelector('.acceptContentWarning'),
			gameplayUI: document.querySelector('.gameplayUI'),
			introModal: document.querySelector('.intro'),
			acceptIntroButton: document.querySelector('.acceptIntro'),
			resignButton: document.querySelector('.resignGovernor'),
			inGameModal: document.querySelector('.inGameModal'),
			inGameModalTitle: document.querySelector('.inGameModalTitle'),
			inGameModalText: document.querySelector('.inGameModalText'),
			inGameModalButton1: document.querySelector('.inGameModalButton1'),
			inGameModalButton2: document.querySelector('.inGameModalButton2'),
		}
		
		this.outputs = {
			governorName: document.querySelector('.governorName'),
			orangeFunds: document.querySelector('.orangeFunds'),
			purpleFunds: document.querySelector('.purpleFunds'),
			date: document.querySelector('.date'),
			temperature: document.querySelector('.temperature'),
			gridStability: document.querySelector('.gridStability'),
			gazzUsage: document.querySelector('.gazzUsageValue'),
			gazzUsagePercentChange: document.querySelector('.gazzUsagePercentChange'),
			genDemand: document.querySelector('.genDemandValue'),
			genDemandPercentChange: document.querySelector('.genDemandPercentChange'),
			genCount: document.querySelector('.genCountValue'),
			gazzIndustryDonations: document.querySelector('.gazzIndustryValue'),
			energyIndustryDonations: document.querySelector('.energyIndustryValue'),
			generatorIndustryDonations: document.querySelector('.generatorIndustryValue'),
			populationFields: document.querySelectorAll('.populationValue'),
			populationPercentChangeFields: document.querySelectorAll('.populationValuePercentChange'),
			popApproval: document.querySelector('.popApprovalValue'),
			popInDanger: document.querySelector('.popInDangerValue'),
		}
		
		this.regions = {
			Horn: document.querySelector('.hornReg'),
			EHorn: document.querySelector('.eHornReg'),
			Hammertown: document.querySelector('.hammerTownReg'),
			Step: document.querySelector('.stepReg'),
			Face: document.querySelector('.faceReg'),
			Pritchel: document.querySelector('.pritchelReg'),
			Hardie: document.querySelector('.hardieReg'),
			Chica: document.querySelector('.chicaReg'),
			Bayshore: document.querySelector('.bayshoreReg'),
			Youstonia: document.querySelector('.youstoniaReg'),
			Bull: document.querySelector('.bullReg'),
			Amalgopolis: document.querySelector('.amalgoReg'),
			Arlen: document.querySelector('.arlenReg'),
			Cuprite: document.querySelector('.cupriteReg'),
			Santo: document.querySelector('.santoReg'),
			Haustin: document.querySelector('.haustinReg'),
			Duro: document.querySelector('.duroReg'),
			Karensville: document.querySelector('.karenReg'),
			Skillet: document.querySelector('.skilletReg'),
			Fort: document.querySelector('.fortReg'),
		}
		
		this.startup = undefined;
		
		this.contentWarningAccepted = false;
		this.introAccepted = false;
		
		this.elements.acceptContentWarning.onclick = this.acceptContentWarning.bind(this);
		this.elements.acceptIntroButton.onclick = this.acceptIntro.bind(this);
	}
	
	acceptContentWarning(e) {
		e.preventDefault();
		this.contentWarningAccepted = true;
		this.hide(this.elements.contentWarning);
		this.show(this.elements.introModal);
	}
	
	acceptIntro(e) {
		e.preventDefault();
		if(!this.contentWarningAccepted) { return }
		
		this.introAccepted = true;
		this.hide(this.elements.introModal);
		this.show(this.elements.gameplayUI);
		
		if (this.startup != undefined) {
			this.startup();
		}
	}
	
	hide(element) {
		element.setAttribute('aria-hidden', 'true');
	}
	
	remove(element) {
		element.classList.add('removed');
	}
	
	show(element) {
		element.setAttribute('aria-hidden', 'false');
		element.classList.remove('removed');
	}
	
	showInGameModal(title, text, button1Text, button1Action, button2Text, button2Action) {
		if (button1Text == undefined) {
			this.remove(this.elements.inGameModalButton1);
		} else {
			this.show(this.elements.inGameModalButton1);
		}
		
		if (button2Text == undefined) {
			this.remove(this.elements.inGameModalButton2);
		} else {
			this.show(this.elements.inGameModalButton2);
		}
		
		this.elements.inGameModalTitle.textContent = title;
		this.elements.inGameModalText.textContent = text;
		this.elements.inGameModalButton1.textContent = button1Text;
		this.elements.inGameModalButton2.textContent = button2Text;
		this.elements.inGameModalButton1.onclick = button1Action;
		this.elements.inGameModalButton2.onclick = button2Action;
		
		setTimeout(function() {
			this.show(this.elements.inGameModal);
		}.bind(this), 10);
	}
	
	clearInGameModal() {
		this.hide(this.elements.inGameModal);
		this.elements.inGameModalButton1.onclick = '';
		this.elements.inGameModalButton2.onclick = '';
	}
	
	setupRegions(simulation) {
		for (const theRegion in this.regions) {
			const region = theRegion;
			this.regions[region].onclick = function(e) {
				let turningPowerOff = simulation.world[region].isPowered;
				if (turningPowerOff) {
					this.regions[region].classList.add('unpowered');
					simulation.world[region].isPowered = false;
				} else {
					const excessPowerPopCapacity = simulation.availablePowerRatio * simulation.getPopulation() - simulation.getPopUsingGrid();
					const dependentPopInRegion = simulation.world[region].getPopDependentOnGrid();
					
					if(dependentPopInRegion <= excessPowerPopCapacity) {
						this.regions[region].classList.remove('unpowered');
						simulation.world[region].isPowered = true;
					}
				}
			}.bind(this);
		}
	}
	
	updateRegions(simulation) {
		for (const region in this.regions) {
			const simRegion = simulation.world[region];
			
			// update powered state
			if (simRegion.isPowered) {
				this.regions[region].classList.remove('unpowered');
			} else {
				this.regions[region].classList.add('unpowered');
			}
			
			// update cold state
			if (simRegion.indoorTemperature < 60) {
				this.regions[region].classList.add('cold');
			} else {
				this.regions[region].classList.remove('cold');
			}
			
			// if region is close to danger level, show danger warning
			if (simRegion.indoorTemperature < 52) {
				this.regions[region].classList.add('danger');
			} else {
				this.regions[region].classList.remove('danger');
			}
		}
	}
}

export { UI };