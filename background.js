// Service worker en segundo plano (Manifest V3)

// Se ejecuta al instalar o actualizar la extensión
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extensión instalada correctamente:', details.reason);

  // Inicializar valores predeterminados en el almacenamiento si no existen
  chrome.storage.local.get(['counter'], (result) => {
    if (result.counter === undefined) {
      chrome.storage.local.set({ counter: 0 });
    }
  });
});
