// Content Script: Se ejecuta directamente en el contexto del DOM de cada página web

console.log('🚀 [Mi Extensión Chrome] Content script cargado en:', window.location.href);

// Escuchar mensajes enviados desde el popup o background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'GET_PAGE_STATS') {
    const imagesCount = document.querySelectorAll('img').length;
    const linksCount = document.querySelectorAll('a').length;
    const paragraphsCount = document.querySelectorAll('p').length;

    sendResponse({
      images: imagesCount,
      links: linksCount,
      paragraphs: paragraphsCount
    });
  }
  return true;
});
