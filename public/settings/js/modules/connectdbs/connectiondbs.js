import { generateId, getBackendBaseUrl } from '../../../../scripts/config.js';
import { ApiClient } from '../apiClient.js';
import { NotificationManager } from '../logManager.js';

const notification = new NotificationManager();
const DB_BASE_URL = `${getBackendBaseUrl()}/connectiondbs`;
const CONTEXT_DB_BASE_URL = `${getBackendBaseUrl()}/contexts`;

export class ConnectDbsManager {
  constructor() {
    this.connections = [];
    this.contexts = [];
    this.currentConnectionId = null;
    this.apiClient = new ApiClient(DB_BASE_URL);
    this.apiContextClient = new ApiClient(CONTEXT_DB_BASE_URL);
  }

  async initialize() {
    await this.loadConnections();
    await this.loadContexts();
    this.setupEventListeners();
    this.renderConnections();
    this.renderContexts();
  }

  async loadConnections() {
    const result = await this.apiClient.fetch({ endpoint: 'find' });
    this.connections = result.data;
  }

  async loadContexts() {
    const result = await this.apiContextClient.fetch({ endpoint: 'find', body: { filter: { type: 'DB' } } });
    this.contexts = result.data;
  }

  setupEventListeners() {
    // Obtener referencias a los elementos DOM
    const elements = {
      addBtn: document.getElementById('addConnectionBtn'),
      cancelBtn: document.getElementById('cancelConnectionBtn'),
      modal: document.getElementById('connectionModal'),
      form: document.getElementById('connectionForm'),
      connectionsList: document.getElementById('connectionsList'),

      addContextBtn: document.getElementById('addContextConnectionBtn'),
      cancelContextBtn: document.getElementById('cancelContextConnectionBtn'),
      contextModal: document.getElementById('context-connectionModal'),
      contextForm: document.getElementById('context-connectionForm'),
    };

    // Añadir event listeners si existen los elementos
    if (elements.addBtn) {
      elements.addBtn.addEventListener('click', () => this.showModal());
    }

    if (elements.cancelBtn) {
      elements.cancelBtn.addEventListener('click', () => this.hideModal());
    }

    if (elements.addContextBtn) {
      elements.addContextBtn.addEventListener('click', () => this.showContextModal());
    }

    if (elements.cancelContextBtn) {
      elements.cancelContextBtn.addEventListener('click', () => this.hideContextModal());
    }

    if (elements.modal) {
      elements.modal.addEventListener('click', (e) => {
        if (e.target === elements.modal) this.hideModal();
      });
    }

    if (elements.form) {
      elements.form.addEventListener('submit', (e) => this.handleConnectionSubmit(e));
    }

    if (elements.contextModal) {
      elements.contextModal.addEventListener('click', (e) => {
        if (e.target === elements.contextModal) this.hideContextModal();
      });
    }

    if (elements.contextForm) {
      elements.contextForm.addEventListener('submit', (e) => this.handleContextConnectionSubmit(e));
    }

    this.setupConnectionCardListeners(elements.connectionsList);
  }

  setupConnectionCardListeners(connectionsList) {
    if (!connectionsList) return;

    connectionsList.addEventListener('click', (e) => {
      const connectionCard = e.target.closest('.connection-card');
      if (!connectionCard) return;

      const connectionId = connectionCard.dataset.connectionId;
      const actionMap = {
        'edit-connection': () => this.showModal(connectionId),
        'delete-connection': () => this.deleteConnection(connectionId),
        'test-connection': () => this.testConnection(connectionId),
      };

      // Buscar qué clase de acción tiene el elemento
      for (const [className, action] of Object.entries(actionMap)) {
        if (e.target.classList.contains(className)) {
          action();
          break;
        }
      }
    });
  }

  renderConnections() {
    const connectionsList = document.getElementById('connectionsList');
    if (!connectionsList) return;
    connectionsList.innerHTML = this.connections
      .map(
        (conn) => `
        <div class="connection-card" data-connection-id="${conn.id}">
          <div class="connection-header">
            <span class="connection-id">Id: ${conn.id}</span>
            <span class="connection-context">${conn.metadata.context.name ? conn.metadata.context.name : 'Sin contexto'}</span>
            <div class="connection-actions">
              <button class="connection-action-btn test-connection" type="button" title="Probar Conexión">🔄</button>
              <button class="connection-action-btn edit-connection" type="button" title="Editar">✏️</button>
              <button class="connection-action-btn delete-connection" type="button" title="Eliminar">🗑️</button>
            </div>
          </div>
          <div class="connection-details">
            <div><span class="connection-label">Nombre:</span> ${conn.name}</div>
            <div><span class="connection-label">Tipo:</span> ${conn.type}</div>
            <div><span class="connection-label">Server:</span> ${conn.server}</div>
            <div><span class="connection-label">Base de Datos:</span> ${conn.database}</div>
            <div><span class="connection-label">Usuario:</span> ${conn.username}</div>
            <div class="connection-description">
              <span class="connection-label">Descripción:</span> ${conn.description || ''}
            </div>
          </div>
        </div>
      `,
      )
      .join('');
  }

  renderContexts() {
    const selectContextElement = document.getElementById('context-connection');

    selectContextElement.innerHTML = '';
    this.contexts.forEach((context) => {
      const option = document.createElement('option');
      option.value = context.id;
      option.textContent = context.name;
      selectContextElement.appendChild(option);
    });

    const selectConnectionElement = document.getElementById('context-connection-apply');
    selectConnectionElement.innerHTML = '';
    this.connections.forEach((connect) => {
      const option = document.createElement('option');
      option.value = connect.id;
      option.textContent = connect.name;
      selectConnectionElement.appendChild(option);
    });
  }

  showModal(connectionId = null) {
    const modal = document.getElementById('connectionModal');
    const form = document.getElementById('connectionForm');
    const modalTitle = document.getElementById('modalTitle');

    if (!modal || !form || !modalTitle) {
      console.error('Elementos del modal no encontrados');
      return;
    }

    this.currentConnectionId = connectionId;
    modalTitle.textContent = connectionId ? 'Editar Conexión' : 'Nueva Conexión';

    if (connectionId) {
      const connection = this.connections.find((c) => `${c.id}` === `${connectionId}`);
      if (connection) this.fillFormWithConnection(connection);
    } else {
      form.reset();
      document.getElementById('connection-id').value = generateId();
    }

    modal.style.display = 'block';
  }

  hideModal() {
    const modal = document.getElementById('connectionModal');
    if (modal) {
      modal.style.display = 'none';
      this.currentConnectionId = null;
    }
  }

  showContextModal() {
    const modal = document.getElementById('context-connectionModal');
    const form = document.getElementById('context-connectionForm');
    const modalTitle = document.getElementById('context-connection-modalTitle');

    if (!modal || !form || !modalTitle) {
      console.error('Elementos del modal no encontrados');
      return;
    }

    modalTitle.textContent = 'Aplicar un contexto a la conexión';
    form.reset();
    modal.style.display = 'block';
  }

  hideContextModal() {
    const modal = document.getElementById('context-connectionModal');
    if (modal) {
      modal.style.display = 'none';
      this.currentConnectionId = null;
    }
  }

  fillFormWithConnection(connection) {
    const form = document.getElementById('connectionForm');
    if (!form) return;

    const fields = [
      { id: 'connection-id', value: connection.id },
      { id: 'connection-name', value: connection.name },
      { id: 'connection-type', value: connection.type },
      { id: 'connection-server', value: connection.server },
      { id: 'connection-database', value: connection.database },
      { id: 'connection-username', value: connection.username },
      { id: 'connection-password', value: connection.password || '' },
      { id: 'connection-description', value: connection.description || '' },
    ];

    fields.forEach((field) => {
      const element = form.querySelector(`#${field.id}`);
      if (element) element.value = field.value;
    });
  }

  async handleContextConnectionSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const connectionData = {
      connectiondbId: formData.get('context-connection-apply'),
      contextId: formData.get('context-connection'),
    };

    await this.apiClient.fetch({ endpoint: 'apply-context', body: connectionData });
    this.hideContextModal();
    await this.loadConnections();
    this.renderConnections();
    notification.show('Contexto aplicado exitosamente', 'success');
  }

  async handleConnectionSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const connectionData = {
      id: this.currentConnectionId || generateId(),
      name: formData.get('connection-name'),
      type: formData.get('connection-type'),
      server: formData.get('connection-server'),
      database: formData.get('connection-database'),
      username: formData.get('connection-username'),
      password: formData.get('connection-password'),
      description: formData.get('connection-description'),
    };

    try {
      await this.apiClient.fetch({ endpoint: 'save', body: connectionData });
      this.hideModal();
      await this.loadConnections();
      this.renderConnections();
      this.renderContexts();
      notification.show('Conexión guardada exitosamente', 'success');
    } catch (error) {}
  }

  async deleteConnection(connectionId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta conexión?')) {
      return;
    }

    try {
      await this.apiClient.fetch({ endpoint: 'remove', body: { filter: { id: connectionId } } });
      await this.loadConnections();
      this.renderConnections();
      this.renderContexts();
      notification.show('Conexión eliminada exitosamente', 'success');
    } catch (error) {}
  }

  async testConnection(connectionId) {
    try {
      const connection = this.connections.find((c) => `${c.id}` === `${connectionId}`);
      if (!connection) {
        throw new Error('Conexión no encontrada');
      }
      await this.apiClient.fetch({ endpoint: 'test', body: connection });
      notification.show('Conexión exitosa a la base de datos', 'success');
    } catch (error) {}
  }
}
