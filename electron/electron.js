const path = require('path');
const { app, BrowserWindow, shell } = require('electron');

// Détermination du mode de l'application (développement ou production)
const isDev = process.env.IS_DEV == "true" ? true : false;

// Crée la fenêtre principale de l'application
function createWindow() {
  // Chemin vers l'icône de l'application
  const iconPath = path.join(__dirname, '..', 'src', 'Icons', 'logo.ico');
  const mainWindow = new BrowserWindow({
    width: 1224,
    height: 750,
    icon: iconPath, 
    autoHideMenuBar: true, 
    resizable: true, 
    frame: true, // Affiche les bordures et la barre de titre de la fenêtre
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Chemin vers le script de préchargement
      nodeIntegration: true, // Active l'intégration de Node.js dans le contexte de rendu
      contextIsolation: false // Désactive l'isolation du contexte pour permettre l'accès aux API Node.js
    },
  });

  // Gestionnaire pour les liens externes ouverts dans l'application
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url); // Ouvre les liens externes dans le navigateur par défaut
    return { action: "deny" }; // Empêche l'ouverture de nouvelles fenêtres Electron
  });

  // Charge l'URL de l'application en fonction du mode (développement ou production)
  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000' // URL de développement
      : `file://${path.join(__dirname, '../dist/index.html')}` // URL de production
  );

  // Ouvre les outils de développement en mode développement
  if (isDev) {
    mainWindow.webContents.openDevTools(); 
  }
}

// Création de la fenêtre principale une fois que l'application est prête
app.whenReady().then(() => {
  createWindow();
  // Recrée une fenêtre si l'application est réactivée et qu'aucune fenêtre n'est ouverte (macOS)
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quitte l'application lorsque toutes les fenêtres sont fermées, sauf sur macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
