class NotificationManager {
  constructor() {
    this.notification = document.getElementById('notification');
    this.timeout = null;
  }

  show(message, type = 'success') {
    clearTimeout(this.timeout);
    this.notification.textContent = message;
    this.notification.className = `log-viewer__notification log-viewer__notification--${type}`;
    this.notification.style.display = 'block';

    this.timeout = setTimeout(() => {
      this.notification.style.display = 'none';
    }, 3000);
  }
}

class LogManager {
  constructor(tableId, notificationManager) {
    this.table = document.getElementById(tableId);
    this.notifications = notificationManager;
    this.baseUrl = 'http://localhost:8001/components/syslog';
  }

  async fetchLogs(filter = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      });

      if (!response.ok) {
        throw new Error('Error al cargar los logs');
      }

      const res = await response.text();
      return JSON.parse(res).data;
    } catch (error) {
      throw new Error('Error al obtener los logs: ' + error.message);
    }
  }

  async clearLogs(filter = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/clear`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filter }),
      });

      if (!response.ok) {
        throw new Error('Error al limpiar los logs');
      }

      return await response.json();
    } catch (error) {
      throw new Error('Error al limpiar los logs: ' + error.message);
    }
  }

  updateTable(logs) {
    const tbody = this.table.querySelector('tbody');
    tbody.innerHTML = '';

    logs.forEach((log) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                        <td>${log.id}</td>
                        <td>${log.level}</td>
                        <td>${log.source}</td>
                        <td>${log.message}</td>
                        <td>${typeof log.metadata === 'object' ? JSON.stringify(log.metadata) : log.metadata}</td>
                        <td>${log.createdAt}</td>
                    `;
      tbody.appendChild(row);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const notificationManager = new NotificationManager();
  const logManager = new LogManager('logsTable', notificationManager);
  const filterInput = document.getElementById('filterInput');
  const searchBtn = document.getElementById('searchBtn');
  const clearBtn = document.getElementById('clearBtn');

  const parseFilter = () => {
    try {
      return filterInput.value ? JSON.parse(filterInput.value) : {};
    } catch (error) {
      throw new Error('Filtro JSON inválido');
    }
  };

  logManager
    .fetchLogs()
    .then((logs) => logManager.updateTable(logs))
    .catch((error) => notificationManager.show(error.message, 'error'));

  searchBtn.addEventListener('click', async () => {
    try {
      const filter = parseFilter();
      const logs = await logManager.fetchLogs(filter);
      logManager.updateTable(logs);
      notificationManager.show('Logs actualizados exitosamente');
    } catch (error) {
      notificationManager.show(error.message, 'error');
    }
  });

  clearBtn.addEventListener('click', async () => {
    try {
      const filter = parseFilter();
      await logManager.clearLogs(filter);
      const logs = await logManager.fetchLogs({});
      logManager.updateTable(logs);
      notificationManager.show('Logs limpiados exitosamente');
    } catch (error) {
      notificationManager.show(error.message, 'error');
    }
  });

  filterInput.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      searchBtn.click();
    }
  });
});
