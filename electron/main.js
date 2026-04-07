const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow;
let backendProcess; // used only in unpackaged prod mode (start.sh prod)

function waitForBackend(retries, delay, callback) {
  http.get('http://localhost:3000/check-auth', () => {
    callback(null);
  }).on('error', () => {
    if (retries === 0) return callback(new Error('Backend did not start in time'));
    setTimeout(() => waitForBackend(retries - 1, delay, callback), delay);
  });
}

function startBackend() {
  if (app.isPackaged) {
    // Packaged AppImage/deb: no node binary available, require() directly.
    // Electron's main process IS Node.js, so this works.
    // Backend deps are bundled in app.asar/node_modules (via electron/package.json dependencies).
    const serverPath = path.join(app.getAppPath(), 'backend', 'src', 'server.js');
    require(serverPath);
  } else {
    // Unpackaged prod (start.sh prod): spawn node normally
    const { spawn } = require('child_process');
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
}

function createWindow() {
  // Window icon: from extraResources in packaged mode, from source tree otherwise
  const iconPath = app.isPackaged
    ? path.join(process.resourcesPath, 'logo.png')
    : path.join(__dirname, '..', 'frontend', 'public', 'images', 'logo.png');

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    },
    icon: iconPath,
    title: 'MyDrugs'
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL('http://localhost:4200');
  } else if (app.isPackaged) {
    // Packaged: frontend bundled at app.asar/frontend/ (built with baseHref ./)
    const indexPath = path.join(app.getAppPath(), 'frontend', 'index.html');
    mainWindow.loadFile(indexPath);
  } else {
    // Unpackaged prod (start.sh prod): load from local dist
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
    // Dev mode: backend + ng serve already running via start.sh
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
