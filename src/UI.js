class UI {
	constructor() {
		this.elements = {
			contentWarning: document.querySelector('.contentWarning'),
			acceptContentWarning: document.querySelector('.acceptContentWarning'),
		}
		
		this.contentWarningAccepted = false;
		
		this.elements.acceptContentWarning.onclick = this.acceptContentWarning.bind(this);
	}
	
	acceptContentWarning(e) {
		e.preventDefault();
		this.contentWarningAccepted = true;
		this.elements.contentWarning.classList.add("hidden");
	}
}

export { UI };