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
}

export { UI };