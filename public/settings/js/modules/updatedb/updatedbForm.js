import { NotificationManager } from '../logManager.js';
import { getBackendBaseUrl, getWsNotificationUrl } from '../../../../scripts/config.js';
import { io } from 'https://cdn.socket.io/4.7.2/socket.io.esm.min.js';

const API_UPLOAD_URL = `${getBackendBaseUrl()}/update/db/upload`;
const SOCKET_URL = `${getWsNotificationUrl()}/ws/updatedb/notification`;
const userId = 'core';

const API_VERSION_URL = `${getBackendBaseUrl()}/versions`;

export async function loadVersion() {
  const response = await fetch(`${API_VERSION_URL}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al cargar los logs');
  }

  const res = await response.json();
  if (res.status === 'error') {
    throw new Error(res.errors[0].message);
  }

  const versions = res.data;
  const lbversion = document.getElementById('version');
  lbversion.innerHTML = `💾 Version DB: ${versions?.db?.codigo || ' 0.0.0 '}  ⚙️ Version APP-DB: ${versions?.app?.codigo || ' 0.0.0 '}`;
}

export async function initializeUpdateDbForm() {
  const ms = new NotificationManager();
  let socket = null;

  await loadVersion();

  try {
    const form = document.getElementById('updateDbForm');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('zipFileInput');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const terminal = document.getElementById('terminal');
    const clearBtn = document.getElementById('clearTerminalBtn');

    // Limpiar terminal
    clearBtn.addEventListener('click', () => {
      terminal.innerHTML = '';
      addTerminalEntry('Terminal limpiado', 'info');
    });

    // Manejar subida de archivo
    uploadBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      const file = fileInput.files[0];
      if (!file) {
        ms.show('Por favor selecciona un archivo ZIP', 'error');
        return;
      }

      if (!file.name.toLowerCase().endsWith('.zip')) {
        ms.show('Solo se permiten archivos ZIP', 'error');
        return;
      }

      try {
        uploadBtn.disabled = true;
        uploadBtn.textContent = 'Subiendo...';

        // Limpiar terminal y mostrar inicio
        terminal.innerHTML = '';
        addTerminalEntry('Iniciando proceso de actualización de base de datos...', 'info');
        addTerminalEntry(`Archivo seleccionado: ${file.name}`, 'info');

        // Conectar WebSocket antes de subir
        await connectWebSocket();

        // Subir archivo
        const formData = new FormData();
        formData.append('userId', userId); // Deberías obtener esto del contexto del usuario
        formData.append('file', file);

        const response = await fetch(API_UPLOAD_URL, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Error al subir el archivo');
        }

        const result = await response.json();
        if (result.status === 'error') {
          throw new Error(result.errors[0].message);
        }

        //addTerminalEntry(`Archivo subido correctamente. Job ID: ${result.jobId}`, 'success');
        //addTerminalEntry('Esperando notificaciones de progreso...', 'info');
      } catch (error) {
        addTerminalEntry(`Error: ${error.message}`, 'error');
        ms.show(error.message, 'error');
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Subir Archivo';
      }
    });

    async function connectWebSocket() {
      return new Promise((resolve, reject) => {
        try {
          socket = io(`${SOCKET_URL}`, {
            query: { userId },
          });

          socket.on('connect', () => {
            addTerminalEntry('Conectado al servidor de notificaciones', 'success');
            resolve();
          });

          socket.on('progress', (data) => {
            handleProgressUpdate(data);
          });

          socket.on('completed', (data) => {
            handleJobCompleted(data);
          });

          socket.on('failed', (data) => {
            handleJobFailed(data);
          });

          socket.on('disconnect', () => {
            addTerminalEntry('Desconectado del servidor de notificaciones', 'warning');
          });

          socket.on('connect_error', (error) => {
            addTerminalEntry(`Error de conexión: ${error.message}`, 'error');
            reject(error);
          });
        } catch (error) {
          reject(error);
        }
      });
    }

    function handleProgressUpdate(data) {
      const progress = data.progress || 0;
      const fileName = data.fileName || 'Desconocido';
      const status = data.status || 'progress';
      const message = data.message || '';

      // Actualizar barra de progreso
      updateProgressBar(progress);

      // Agregar entrada al terminal
      let statusText = '';
      let statusClass = 'info';

      switch (status) {
        case 'progress':
          statusText = 'PROCESANDO';
          statusClass = 'info';
          break;
        case 'already_updated':
          statusText = 'OMITIDO';
          statusClass = 'warning';
          break;
        default:
          statusText = status.toUpperCase();
          statusClass = 'info';
      }

      const logMessage = message ? `[${progress}%] ${fileName} - ${statusText} - ${message}` : `[${progress}%] ${fileName} - ${statusText}`;

      addTerminalEntry(logMessage, statusClass);
    }

    function handleJobCompleted(data) {
      updateProgressBar(100);
      addTerminalEntry('✅ PROCESO COMPLETADO EXITOSAMENTE', 'success');
      addTerminalEntry(data.message || 'Base de datos actualizada correctamente', 'success');

      // Resetear formulario después de unos segundos
      setTimeout(() => {
        resetForm();
      }, 3000);
    }

    function handleJobFailed(data) {
      addTerminalEntry('❌ PROCESO FALLIDO', 'error');
      addTerminalEntry(data.message || 'Error desconocido', 'error');
      resetForm();
    }

    function updateProgressBar(progress) {
      progressBar.style.width = `${progress}%`;
      progressText.textContent = `${progress}%`;
    }

    function addTerminalEntry(message, type = 'info') {
      const now = new Date();
      // const timestamp = now.toLocaleString('es-MX', {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   second: '2-digit',
      //   hour12: false,
      // });
      const timestamp = now.toLocaleTimeString('es-MX', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });

      const entry = document.createElement('div');
      entry.className = `terminal-entry terminal-${type}`;

      entry.innerHTML = `
        <span class="terminal-timestamp">[${timestamp}]  <span class="terminal-message">${message}</span></span>
      `;

      terminal.appendChild(entry);
      terminal.scrollTop = terminal.scrollHeight;
    }

    function resetForm() {
      fileInput.value = '';
      updateProgressBar(0);
      uploadBtn.disabled = false;
      uploadBtn.textContent = 'Subir Archivo';

      if (socket) {
        socket.disconnect();
        socket = null;
      }
    }

    // Inicializar terminal con mensaje de bienvenida
    addTerminalEntry('Terminal lista para procesar actualizaciones de base de datos', 'info');
  } catch (error) {
    ms.show(error.message, 'error');
  }
}
