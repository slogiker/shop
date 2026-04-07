const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let backendProcess;

function waitForBackend(retries, delay, callback) {
  http.get('http://localhost:3000/check-auth', () => {
    callback(null);
  }).on('error', () => {
    if (retries === 0) return callback(new Error('Backend did not start in time'));
    setTimeout(() => waitForBackend(retries - 1, delay, callback), delay);
  });
}

function startBackend() {
  const backendPath = path.join(__dirname, '..', 'backend', 'src', 'server.js');
  backendProcess = spawn('node', [backendPath], {
    cwd: path.join(__dirname, '..', 'backend'),
    env: { ...process.env },
    stdio: 'inherit'
  });
  backendProcess.on('error', (err) => {
    console.error('[electron] Backend process error:', err);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: path.join(__dirname, '..', 'frontend', 'public', 'images', 'logo.png'),
    title: 'Shop'
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
  } else {
    const indexPath = path.join(
      __dirname, '..', 'frontend', 'dist', 'frontend', 'browser', 'index.html'
    );
    mainWindow.loadFile(indexPath);
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  if (isDev) {
    createWindow();
  } else {
    startBackend();
    waitForBackend(20, 500, (err) => {
      if (err) console.error('[electron] Backend timeout:', err.message);
      createWindow();
    });
  }
});

app.on('window-all-closed', () => {
  if (backendProcess) {
    backendProcess.kill();
    backendProcess = null;
  }
  app.quit();
});
