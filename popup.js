// Elementos del DOM
const counterValueEl = document.getElementById('counter-value');
const btnIncrement = document.getElementById('btn-increment');
const btnInspectTab = document.getElementById('btn-inspect-tab');
const btnPageStats = document.getElementById('btn-page-stats');
const btnHighlight = document.getElementById('btn-highlight');
const tabInfoEl = document.getElementById('tab-info');
const statusMsgEl = document.getElementById('status-msg');

// 1. Cargar el valor guardado en el almacenamiento local
chrome.storage.local.get(['counter'], (result) => {
  const currentCount = result.counter || 0;
  counterValueEl.textContent = currentCount;
});

// Incrementar contador y guardar en chrome.storage
btnIncrement.addEventListener('click', () => {
  chrome.storage.local.get(['counter'], (result) => {
    const newCount = (result.counter || 0) + 1;
    chrome.storage.local.set({ counter: newCount }, () => {
      counterValueEl.textContent = newCount;
      statusMsgEl.textContent = `Guardado: Contador es ${newCount}`;
    });
  });
});

// 2. Leer información de la pestaña activa
btnInspectTab.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab) {
      tabInfoEl.style.display = 'block';
      tabInfoEl.textContent = `📄 ${tab.title || 'Sin título'} (${new URL(tab.url).hostname || tab.url})`;
      statusMsgEl.textContent = 'Pestaña inspeccionada con éxito';
    }
  } catch (error) {
    statusMsgEl.textContent = 'Error al leer la pestaña';
    console.error(error);
  }
});

// 2.b. Obtener estadísticas de la página a través del Content Script
btnPageStats.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    chrome.tabs.sendMessage(tab.id, { action: 'GET_PAGE_STATS' }, (response) => {
      if (chrome.runtime.lastError || !response) {
        statusMsgEl.textContent = 'Actualiza la página web para cargar el script';
        return;
      }
      tabInfoEl.style.display = 'block';
      tabInfoEl.textContent = `📊 Elementos: ${response.images} imágenes, ${response.links} enlaces, ${response.paragraphs} párrafos.`;
      statusMsgEl.textContent = 'Estadísticas obtenidas';
    });
  } catch (error) {
    statusMsgEl.textContent = 'Error al consultar la página';
  }
});

// 3. Modificar temporalmente la página web activa con scripting API
btnHighlight.addEventListener('click', async () => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return;

    // Solo se puede inyectar en páginas web estándar (http/https)
    if (!tab.url.startsWith('http://') && !tab.url.startsWith('https://')) {
      statusMsgEl.textContent = 'Abre una web (ej. google.com) para probar esto';
      return;
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        // Efecto visual temporal en la página
        const banner = document.createElement('div');
        banner.textContent = '⚡ ¡Mensaje inyectado por tu Extensión de Chrome!';
        banner.style.position = 'fixed';
        banner.style.top = '20px';
        banner.style.right = '20px';
        banner.style.zIndex = '999999';
        banner.style.backgroundColor = '#10b981';
        banner.style.color = '#ffffff';
        banner.style.padding = '12px 20px';
        banner.style.borderRadius = '8px';
        banner.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
        banner.style.fontWeight = 'bold';
        banner.style.fontSize = '14px';
        banner.style.transition = 'opacity 0.5s ease';
        document.body.appendChild(banner);

        setTimeout(() => {
          banner.style.opacity = '0';
          setTimeout(() => banner.remove(), 500);
        }, 3000);
      }
    });

    statusMsgEl.textContent = '¡Efecto enviado a la página!';
  } catch (error) {
    statusMsgEl.textContent = 'No se pudo inyectar en esta página';
    console.error(error);
  }
});
