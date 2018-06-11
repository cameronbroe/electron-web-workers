const { app, BrowserWindow } = require('electron');

let mainWindow;

function createMainWindow() {
	mainWindow = new BrowserWindow({
		width: 800,
		height: 650
	});

	mainWindow.loadFile('view/index.html');

	mainWindow.on('closed', () => { mainWindow = null; })
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