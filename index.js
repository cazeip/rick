const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const url = require('url');
const DiscordRPC = require('discord-rpc');
let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1280,
		height: 720,
		minWidth: 940,
		minHeight: 500,
		resizable: true,
		title: "Rick",
		frame: false,
		webPreferences: {
			nodeIntegration: true,
			enableRemoteModule: true,
		},
		backgroundColor: '#2b2b2b'
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, '/UI/index.html'),
		protocol: 'file:',
		slashes: true,
	}));

	mainWindow.on('closed', () => {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
	app.quit();
});

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow();
	}
});

ipcMain.on("close", (event, data) => {
	app.quit();
});

ipcMain.on("minimize", (event, data) => {
	mainWindow.minimize();
});

ipcMain.on("maximize", (event, data) => {
	
	mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
});

let rpc = new DiscordRPC.Client({ transport: 'ipc' });
ipcMain.on('startRpc', (event, data) => {
	console.log(data)
	let clientId = data["app-id"];
	try{
		rpc.clearActivity();
		rpc.destroy();
	}catch(e){}
	rpc = new DiscordRPC.Client({ transport: 'ipc' });
	rpc.login({ clientId }).catch(console.error);
	rpc.on('ready', () => {
		rpc.setActivity({
			details: data.rpc.details,
			state: data.rpc.state,
			partySize : data.rpc.partySize,
			partyMax : data.rpc.partyMax,
			largeImageKey: data.rpc.largeImageKey,
			largeImageText: data.rpc.largeImageText,
			smallImageKey: data.rpc.smallImageKey,
			smallImageText: data.rpc.smallImageText,
			startTimestamp: data.rpc.startTimestamp,
			endTimestamp: data.rpc.endTimestamp,
			instance: false
		});
	});
});