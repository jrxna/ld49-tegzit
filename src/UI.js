class UI {
	constructor() {
		this.elements = {
			contentWarning: document.querySelector('.contentWarning'),
			acceptContentWarning: document.querySelector('.acceptContentWarning'),
			gameplayUI: document.querySelector('.gameplayUI'),
			introModal: document.querySelector('.intro'),
			acceptIntroButton: document.querySelector('.acceptIntro'),
			resignButton: document.querySelector('resignGovernor'),
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
			genSales: document.querySelector('.genSalesValue'),
			genSalesPercentChange: document.querySelector('.genSalesPercentChange'),
			gazzIndustryDonations: document.querySelector('.gazzIndustryValue'),
			energyIndustryDonations: document.querySelector('.energyIndustryValue'),
			generatorIndustryDonations: document.querySelector('.generatorIndustryValue'),
			populationFields: document.querySelectorAll('.populationValue'),
			populationPercentChangeFields: document.querySelectorAll('.populationValuePercentChange'),
			popApproval: document.querySelector('.popApprovalValue'),
			popInDanger: document.querySelector('.popInDangerValue'),
		}
		
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
}

export { UI };