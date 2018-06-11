const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", () => {
	// Get spinner object
	let spinner = document.querySelector('#spinner');
	// Initialize updateTimeout object
	let updateTimeout = null;

	ipcRenderer.on('pot-update', (event, data) => {
		if(updateTimeout) {
			clearTimeout(updateTimeout);
		}
		updateTimeout = setTimeout(() => {
			// Update spinner animation duration
			spinner.style.animationDuration = `${data.oneRev}ms`;
		}, 500);
		// Update speed indicator
		document.querySelector('#current-speed').innerHTML = `${data.rpm} RPM`;
	});
});