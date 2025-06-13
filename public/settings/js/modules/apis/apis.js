import { generateId, getBackendBaseUrl } from "../../../../scripts/config.js";
import { ApiClient } from '../apiClient.js';
import { NotificationManager } from '../logManager.js';

const API_BASE_URL = `${getBackendBaseUrl()}/apis`;
const CONTEXT_BASE_URL = `${getBackendBaseUrl()}/contexts`;

export class ApisManager {
  constructor() {
    this.apis = [];
    this.contexts = [];
    this.currentApiId = null;
    this.apiClient = new ApiClient(API_BASE_URL);
    this.contextClient = new ApiClient(CONTEXT_BASE_URL);
    this.notification = new NotificationManager();
  }

  async initialize() {
    await this.loadApis();
    await this.loadContexts();
    this.setupEventListeners();
    this.renderApis();
    this.renderContextOptions();
  }

  async loadApis() {
    const result = await this.apiClient.fetch({ endpoint: 'find' });
    this.apis = result.data;
  }

  async loadContexts() {
    const result = await this.contextClient.fetch({ endpoint: 'find', body: { filter: { type: 'API' } } });
    this.contexts = result.data;
  }

  setupEventListeners() {
    // Obtener referencias a los elementos DOM
    const elements = {
      // Modal principal de APIs
      addApiBtn: document.getElementById('addApiBtn'),
      cancelApiBtn: document.getElementById('cancelApiBtn'),
      apiModal: document.getElementById('apisModal'),
      apiForm: document.getElementById('apisForm'),
      apisList: document.getElementById('apisList'),

      // Modal de contexto para APIs
      addContextApiBtn: document.getElementById('addContextApiBtn'),
      cancelContextApiBtn: document.getElementById('cancelContextApiBtn'),
      contextApiModal: document.getElementById('context-apiModal'),
      contextApiForm: document.getElementById('context-apiForm'),
    };

    // Configurar los event listeners principales
    if (elements.addApiBtn) {
      elements.addApiBtn.addEventListener('click', () => this.showModal());
    }

    if (elements.cancelApiBtn) {
      elements.cancelApiBtn.addEventListener('click', () => this.hideModal());
    }

    if (elements.apiModal) {
      elements.apiModal.addEventListener('click', (e) => {
        if (e.target === elements.apiModal) this.hideModal();
      });
    }

    if (elements.apiForm) {
      elements.apiForm.addEventListener('submit', (e) => this.handleApiSubmit(e));
    }

    // Configurar event listeners para el modal de contexto
    if (elements.addContextApiBtn) {
      elements.addContextApiBtn.addEventListener('click', () => this.showContextModal());
    }

    if (elements.cancelContextApiBtn) {
      elements.cancelContextApiBtn.addEventListener('click', () => this.hideContextModal());
    }

    if (elements.contextApiModal) {
      elements.contextApiModal.addEventListener('click', (e) => {
        if (e.target === elements.contextApiModal) this.hideContextModal();
      });
    }

    if (elements.contextApiForm) {
      elements.contextApiForm.addEventListener('submit', (e) => this.handleContextApiSubmit(e));
    }

    this.setupApiCardListeners(elements.apisList);
  }

  setupApiCardListeners(apisList) {
    if (!apisList) return;

    apisList.addEventListener('click', (e) => {
      const apiCard = e.target.closest('.api-card');
      if (!apiCard) return;

      const apiId = apiCard.dataset.apiId;

      const actionMap = {
        'edit-api': () => this.showModal(apiId),
        'delete-api': () => this.deleteApi(apiId),
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

  renderApis() {
    const apisList = document.getElementById('apisList');
    if (!apisList) return;

    apisList.innerHTML = this.apis
      .map(
        (api) => `
          <div class="api-card" data-api-id="${api.id}">
            <div class="api-header">
              <span class="api-id">Id: ${api.id}</span>
              <span class="api-context">${api.metadata?.context?.name || 'Sin contexto'}</span>
              <div class="api-actions">
                <button class="api-action-btn edit-api" type="button" title="Editar">✏️</button>
                <button class="api-action-btn delete-api" type="button" title="Eliminar">🗑️</button>
              </div>
            </div>
            <div class="api-details">
              <div><span class="api-label">Tipo:</span> ${api.type}</div>
              <div><span class="api-label">Nombre:</span> ${api.name}</div>
              <div><span class="api-label">Url/Puerto:</span> ${api.url}</div>
              <div class="api-description">
                <span class="api-label">Descripción:</span> ${api.description || ''}
              </div>
            </div>
          </div>
        `,
      )
      .join('');
  }

  renderContextOptions() {
    // Rellenar el selector de contexto
    const contextApiSelect = document.getElementById('context-api');
    const apiSelect = document.getElementById('context-api-apply');

    if (contextApiSelect) {
      contextApiSelect.innerHTML = '';
      this.contexts.forEach((context) => {
        const option = document.createElement('option');
        option.value = context.id;
        option.textContent = context.name;
        contextApiSelect.appendChild(option);
      });
    }

    if (apiSelect) {
      apiSelect.innerHTML = '';
      this.apis.forEach((api) => {
        const option = document.createElement('option');
        option.value = api.id;
        option.textContent = api.name;
        apiSelect.appendChild(option);
      });
    }
  }

  showModal(apiId = null) {
    const modal = document.getElementById('apisModal');
    const form = document.getElementById('apisForm');
    const modalTitle = document.getElementById('modalTitle');

    if (!modal || !form || !modalTitle) {
      console.error('Elementos del modal no encontrados');
      return;
    }

    this.currentApiId = apiId;
    modalTitle.textContent = apiId ? 'Editar API' : 'Nueva API';

    if (apiId) {
      const api = this.apis.find((a) => a.id === apiId);
      if (api) this.fillFormWithApi(api);
    } else {
      form.reset();
      document.getElementById('api-id').value = generateId();
    }

    modal.style.display = 'block';
  }

  hideModal() {
    const modal = document.getElementById('apisModal');
    if (modal) {
      modal.style.display = 'none';
      this.currentApiId = null;
    }
  }

  showContextModal() {
    const modal = document.getElementById('context-apiModal');
    const form = document.getElementById('context-apiForm');

    if (!modal || !form) {
      console.error('Elementos del modal de contexto no encontrados');
      return;
    }

    form.reset();
    modal.style.display = 'block';
  }

  hideContextModal() {
    const modal = document.getElementById('context-apiModal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  fillFormWithApi(api) {
    const form = document.getElementById('apisForm');
    if (!form) return;

    const fields = [
      { id: 'api-id', value: api.id },
      { id: 'api-type', value: api.type },
      { id: 'api-name', value: api.name },
      { id: 'api-url', value: api.url },
      { id: 'api-description', value: api.description || '' },
    ];

    fields.forEach((field) => {
      const element = form.querySelector(`#${field.id}`);
      if (element) element.value = field.value;
    });
  }

  async handleApiSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const apiData = {
      id: formData.get('api-id'),
      type: formData.get('api-type'),
      name: formData.get('api-name'),
      url: formData.get('api-url'),
      description: formData.get('api-description'),
    };

    const ms = new NotificationManager();

    /*
    if (apiData.type === 'URL') {
      if (!isValidHostPort(apiData.url)) {
        const input = document.getElementById('api-url');
        input.focus();
        ms.show('La dirección de la api es incorrecta', 'error');
        return;
      }
    } else if (apiData.type === 'PORT') {
      if (!isValidPort(apiData.url)) {
        const input = document.getElementById('api-url');
        input.focus();
        ms.show('El puerto es incorrecto', 'error');
        return;
      }
    }
    */

    try {
      await this.apiClient.fetch({ endpoint: 'save', body: apiData });
      this.hideModal();
      await this.loadApis();
      this.renderApis();
      this.renderContextOptions();
      this.notification.show('API guardada exitosamente', 'success');
    } catch (error) {
      // El manejo de errores ya está en ApiClient
    }
  }

  async handleContextApiSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const contextData = {
      apiId: formData.get('context-api-apply'),
      contextId: formData.get('context-api'),
    };

    try {
      await this.apiClient.fetch({ endpoint: 'apply-context', body: contextData });
      this.hideContextModal();
      await this.loadApis();
      this.renderApis();
      this.notification.show('Contexto aplicado exitosamente', 'success');
    } catch (error) {
      // El manejo de errores ya está en ApiClient
    }
  }

  async deleteApi(apiId) {
    if (!confirm('¿Estás seguro de que deseas eliminar esta API?')) {
      return;
    }

    try {
      await this.apiClient.fetch({
        endpoint: 'remove',
        body: { filter: { id: apiId } },
      });

      await this.loadApis();
      this.renderApis();
      this.renderContextOptions();
      this.notification.show('API eliminada exitosamente', 'success');
    } catch (error) {
      // El manejo de errores ya está en ApiClient
    }
  }
}
