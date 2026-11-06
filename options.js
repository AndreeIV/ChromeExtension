// Cargar configuración guardada
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get(['userName', 'notificationsEnabled'], (data) => {
    if (data.userName) {
      document.getElementById('userName').value = data.userName;
    }
    if (data.notificationsEnabled !== undefined) {
      document.getElementById('notificationsEnabled').checked = data.notificationsEnabled;
    }
  });
});

// Guardar configuración
document.getElementById('saveBtn').addEventListener('click', () => {
  const userName = document.getElementById('userName').value;
  const notificationsEnabled = document.getElementById('notificationsEnabled').checked;

  chrome.storage.local.set({ userName, notificationsEnabled }, () => {
    const status = document.getElementById('status');
    status.textContent = '¡Preferencias guardadas exitosamente!';
    setTimeout(() => {
      status.textContent = '';
    }, 2500);
  });
});
