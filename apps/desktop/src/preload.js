const { contextBridge, ipcRenderer } = require('electron');

// Expose safe APIs to the React frontend
contextBridge.exposeInMainWorld('electronAPI', {
  // Printing
  printReceipt: (data) => ipcRenderer.invoke('print-receipt', data),
  printKOT: (data) => ipcRenderer.invoke('print-kot', data),

  // Hardware
  openCashDrawer: () => ipcRenderer.invoke('open-cash-drawer'),

  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),

  // Platform check
  platform: process.platform,
  isElectron: true,
});
