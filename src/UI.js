class UI {
	constructor() {
		this.elements = {
			contentWarning: document.querySelector('.contentWarning'),
			acceptContentWarning: document.querySelector('.acceptContentWarning'),
			gameplayUI: document.querySelector('.gameplayUI'),
			introModal: document.querySelector('.intro'),
			acceptIntroButton: document.querySelector('.acceptIntro'),
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
	
	show(element) {
		element.setAttribute('aria-hidden', 'false');
	}
}

export { UI };