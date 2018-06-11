const { app, BrowserWindow, ipcMain } = require('electron');
const five = require('johnny-five');
const board = new five.Board({ repl: false });

let mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 650,
		fullscreen: true
	});

	board.on("ready", () => {
		bootstrapInput();
		bootstrapOutput();
	});

	mainWindow.loadFile('view/index.html');

	mainWindow.on('closed', () => { mainWindow = null; });
}

function bootstrapInput() {
	// Establish connection to potentiometer to read data
	let pot = new five.Sensor("A0");

	// Min and max speeds in RPM
	let minSpeed = 30;
	let maxSpeed = 180;

	// Subscribe to potentiometer change events
	pot.on("change", () => {
		// Scale potentiometer values to min and max RPM speeds
		let value = pot.scaleTo(minSpeed, maxSpeed);
		// Calculate time in milliseconds for one revolution
		let oneRev = Math.floor((60 / value) * 1000);
		// Send information to rendered process
		mainWindow.webContents.send('pot-update', {
			oneRev: oneRev,
			rpm: value
		});
	});
}

function bootstrapOutput() {
	// Establish connection to LED pins
	let leds = {
		red: new five.Led(9),
		green: new five.Led(10),
		blue: new five.Led(11)
	};

	// Subscribe to UI input
	ipcMain.on('led-update', (event, color) => {
		// Toggle the LED that was clicked
		leds[color].toggle();
	});
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
	if(process.platform !== "darwin") {
		app.quit();
	}
});

app.on('activate', () => {
	if(mainWindow === null) {
		createMainWindow();
	}
})