const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Determine if running in development
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    minWidth: 1024,
    minHeight: 600,
    title: 'Restaurant POS',
    icon: path.join(__dirname, '../assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    // POS systems typically run fullscreen
    fullscreen: !isDev,
    autoHideMenuBar: true,
  });

  if (isDev) {
    // In development, load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built React app
    mainWindow.loadFile(path.join(__dirname, '../../frontend/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Prevent accidental close during billing
  mainWindow.on('close', (e) => {
    // You can add a confirmation dialog here
    // e.preventDefault();
  });
}

// ============================================
// APP LIFECYCLE
// ============================================
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// ============================================
// IPC HANDLERS (for printer, hardware, etc.)
// ============================================

// Print receipt
ipcMain.handle('print-receipt', async (_event, receiptData) => {
  try {
    // TODO: Implement actual thermal printer communication
    // const ThermalPrinter = require('node-thermal-printer');
    // const printer = new ThermalPrinter({...});
    console.log('Printing receipt:', receiptData);
    return { success: true };
  } catch (error) {
    console.error('Print error:', error);
    return { success: false, error: error.message };
  }
});

// Print KOT
ipcMain.handle('print-kot', async (_event, kotData) => {
  try {
    console.log('Printing KOT:', kotData);
    return { success: true };
  } catch (error) {
    console.error('KOT print error:', error);
    return { success: false, error: error.message };
  }
});

// Open cash drawer
ipcMain.handle('open-cash-drawer', async () => {
  try {
    console.log('Opening cash drawer');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Get app version
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});
