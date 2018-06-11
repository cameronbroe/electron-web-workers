const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", () => {
	// INPUT EXAMPLE

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

	// END INPUT EXAMPLE

	// OUTPUT EXAMPLE

	// Set up click callback for buttons
	document.querySelectorAll('.button a').forEach((button) => {
		button.addEventListener('click', (event) => {
			// Get the color button that was clicked
			let ledColor = event.target.dataset.color;
			// Send it to main process
			ipcRenderer.send('led-update', ledColor);
			// Update UI
			event.target.classList.toggle('selected');
		});
	});

	// END OUTPUT EXAMPLE
});