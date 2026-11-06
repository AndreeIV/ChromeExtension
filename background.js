// Service Worker en segundo plano (Manifest V3)

// Se ejecuta al instalar o actualizar la extensión
chrome.runtime.onInstalled.addListener((details) => {
  console.log('Extensión instalada/actualizada:', details.reason);

  // Inicializar almacenamiento si no existe
  chrome.storage.local.get(['counter'], (result) => {
    if (result.counter === undefined) {
      chrome.storage.local.set({ counter: 0 });
    }
  });

  // Crear opción en el menú del clic derecho
  chrome.contextMenus.create({
    id: 'buscarTextoSeleccionado',
    title: 'Buscar en Google: "%s"',
    contexts: ['selection']
  });
});

// Manejar clics en el menú contextual (clic derecho)
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'buscarTextoSeleccionado' && info.selectionText) {
    const query = encodeURIComponent(info.selectionText);
    chrome.tabs.create({
      url: `https://www.google.com/search?q=${query}`
    });
  }
});

// Escuchar mensajes provenientes del popup o del content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'PING_BACKGROUND') {
    sendResponse({ reply: 'PONG desde el Service Worker en segundo plano!' });
  }
  return true;
});
