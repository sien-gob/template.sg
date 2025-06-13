import { ApisManager } from './apis/apis.js';
import { ConnectDbsManager } from './connectdbs/connectiondbs.js';
import { initializeLogForm } from './logs/logForm.js';
import { initializeSettingForm } from './settings/settingForm.js';
import { initializeUpdateDbForm } from './updatedb/updatedbForm.js';

const tabs = [
  {
    id: 'setting',
    label: 'Ajustes',
    active: true,
    content: `
            <section class="tab-section">
                <h2>Ajuste General</h2>
                <form id="settingForm" class="settings-form">
                    <div class="form-group">
                      <label>📧 Información de Cliente</label>
                      <div class="input-row">
                          <div class="input-group">
                              <label for="setting-clientId">ID:</label>
                              <input type="text" id="setting-clientId" name="setting-clientId" placeholder="Id Cliente">
                          </div>
                          <div class="input-group">
                              <label for="setting-client-email">Email:</label>
                              <input type="email" id="setting-client-email" name="setting-client-email" placeholder="Email">
                          </div>
                          <div class="input-group">
                              <label for="setting-client-email-pwd">Password:</label>
                              <input type="password" id="setting-client-email-pwd" name="setting-client-email-pwd" placeholder="Password">
                          </div>
                      </div>
                      <p class="help-text">Información general del cliente</p>
                    </div>
                    <div class="form-group">
                      <label>📧 Información de Soporte</label>
                      <div class="input-row">
                          <div class="input-group">
                                <label for="setting-support-name">Nombre:</label>
                                <input type="text" id="setting-support-name" name="setting-support-name" placeholder="Nombre">
                          </div>
                          <div class="input-group">
                                <label for="setting-support-name">Origen:</label>
                                <input type="text" id="setting-support-origin" name="setting-support-origin" placeholder="Origen: ubicación de del backend">
                          </div>
                          <div class="input-group">
                                <label for="setting-support-email">Emails de soporte:</label>
                                <input type="text" id="setting-support-email" name="setting-support-email" placeholder="Emails: email_1@dominio.com, email_2@dominio.com ...">
                          </div>
                      </div>
                      <p class="help-text">Información del responsable de soporte</p>
                    </div>

                    <button type="submit" class="primary-button">Guardar</button>
                    </form>
            </section>
        `,
  },
  {
    id: 'apis',
    label: 'Apis',
    active: true,
    content: `
            <section class="tab-section">
                <div class="tags-row">
                    <h2>Apis de conexión</h2>
                    <p style="color:#FFA500">Requiere reiniciar el backend cualquier cambio</p>
                </div> 
                <p>Administra las urls de conexiones externas</p>
                <div class="apis-container">
                    <button id="addApiBtn" class="primary-button">Agregar nueva api</button>
                    <button id="addContextApiBtn" class="primary-button">Aplicar contexto a la api</button>
                    <div style="margin-top:10px" id="apisList"></div>
                </div>

                <div id="apisModal" class="modal">
                    <div class="modal-content">
                        <h2 id="modalTitle">Nueva Api de conexión</h2>
                        <form id="apisForm" class="settings-form">
                            <div class="form-group">
                                <label for="api-name">Id:</label>
                                <input type="text" id="api-id" name="api-id" placeholder="Id" required>
                            </div>  
                            <div class="form-group">
                                <label for="apiType">Aplica:</label>
                                <select id="api-type" name="api-type" required>
                                    <option value="URL">Dirección URL</option>
                                    <option value="PORT">Puerto de Comunicación</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="api-name">Nombre:</label>
                                <input type="text" id="api-name" name="api-name" placeholder="Nombre" required>
                            </div>
                            <div class="form-group">
                                <label for="api-url">Url/Puerto:</label>
                                <input type="text" id="api-url" name="api-url" placeholder="Url/Puerto" required>
                            </div>
                            <div class="form-group">
                                <label for="api-description">Descripción</label>
                                <textarea id="api-description" name="api-description" rows="3" placeholder="Descripción"></textarea> 
                            </div>
                            <div class="modal-buttons">
                                <button type="submit" class="primary-button">Guardar</button>
                                <button type="button" class="secondary-button" id="cancelApiBtn">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="context-apiModal" class="modal">
                    <div class="modal-content">
                        <h2 id="context-api-modalTitle">Vincular api con el contexto</h2>
                        <form id="context-apiForm" class="settings-form">
                            <div class="form-group">
                                    <div class="form-group">
                                        <label for="context-api-apply">Api:</label>
                                        <select id="context-api-apply" name="context-api-apply" required></select>
                                    </div>
                                    <div class="form-group">
                                        <label for="context-api">Contexto:</label>
                                        <select id="context-api" name="context-api" required></select>
                                    </div>
                                    <div class="modal-buttons">
                                        <button type="submit" class="primary-button">Guardar</button>
                                        <button type="button" class="secondary-button" id="cancelContextApiBtn">Cancelar</button>
                                    </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `,
  },
  {
    id: 'connectionDb',
    label: 'Conexiones Db',
    active: true,
    content: `
            <section class="tab-section">
                <div class="tags-row">
                    <h2>Conexión de base de datos</h2>
                    <p style="color:#FFA500">Requiere reiniciar el backend cualquier cambio</p>
                </div> 
                <p>Administra conexiones de base de datos externas</p>
                <div class="connections-container">
                    <button id="addConnectionBtn" class="primary-button">Agregar nueva conexión</button>
                    <button id="addContextConnectionBtn" class="primary-button">Aplicar contexto a la conexión</button>
                    <div style="margin-top:10px" id="connectionsList"></div>
                </div>

                <div id="connectionModal" class="modal">
                    <div class="modal-content">
                        <h2 id="modalTitle">Nueva Api de conexión</h2>
                        <form id="connectionForm" class="settings-form">
                            <div class="form-group">
                                    <div class="form-group">
                                        <label for="connection-name">Id:</label>
                                        <input type="text" id="connection-id" name="connection-id" placeholder="Id" required>
                                    </div>  
                                    <div class="form-group">
                                        <label for="connection-type">Aplica:</label>
                                        <select id="connection-type" name="connection-type" required>
                                            <option value="postgresql">PostgreSql</option>
                                            <option value="sql-server">Sql Server</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="connection-name">Nombre:</label>
                                        <input type="text" id="connection-name" name="connection-name" placeholder="Nombre" required>
                                    </div>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label for="connection-server">Server:</label>
                                            <input type="text" id="connection-server" name="connection-server" placeholder="Servidor" required>
                                        </div>
                                        <div class="input-group">
                                            <label for="connection-server">Nombre de la base de datos:</label>
                                            <input type="text" id="connection-database" name="connection-database" placeholder="Nombre de la base de datos" required>
                                        </div>
                                    </div>
                                    <div class="input-row">
                                        <div class="input-group">
                                            <label for="connection-user">Usuario:</label>
                                            <input type="text" id="connection-username" name="connection-username" placeholder="Usuario" required>
                                        </div>
                                        <div class="input-group">
                                            <label for="connection-password">Password:</label>
                                            <input type="password" id="connection-password" name="connection-password" placeholder="Password" required>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="connection-description">Descripción</label>
                                        <textarea id="connection-description" name="connection-description" rows="3" placeholder="Descripción"></textarea> 
                                    </div>
                                    <div class="modal-buttons">
                                        <button type="submit" class="primary-button">Guardar</button>
                                        <button type="button" class="secondary-button" id="cancelConnectionBtn">Cancelar</button>
                                    </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div id="context-connectionModal" class="modal">
                    <div class="modal-content">
                        <h2 id="context-connection-modalTitle">Nueva conexión</h2>
                        <form id="context-connectionForm" class="settings-form">
                            <div class="form-group">
                                    <div class="form-group">
                                        <label for="context-connection-apply">Conexión:</label>
                                        <select id="context-connection-apply" name="context-connection-apply" required></select>
                                    </div>
                                    <div class="form-group">
                                        <label for="context-connection">Contexto:</label>
                                        <select id="context-connection" name="context-connection" required></select>
                                    </div>
                                    <div class="modal-buttons">
                                        <button type="submit" class="primary-button">Guardar</button>
                                        <button type="button" class="secondary-button" id="cancelContextConnectionBtn">Cancelar</button>
                                    </div>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        `,
  },
  {
    id: 'logs',
    label: 'Logs',
    active: true,
    content: `
        <section class="tab-section">
            <h2>Logs del sistema</h2>
            <form id="logForm" class="log-form">
                <div class="form-group">
                    <label>💻 Sucesos del sistema</label>
                    <div class="form-group">
                        <label for="filterLog">Filtrar:</label>
                        <textarea id="filterInputLog" name="filterInputLog" rows="8"
                          placeholder="ejemplo: 
1: {'filter':{'level':'INFO'}}
2: {'filter':{'level': { operator: '<>', value: 'INFO' }}}
3: {'filter':{'created_at': { operator: 'BETWEEN', value: ['2024-01-01', '2024-01-31'] }}}
4: {'filter':{ AND: [ { 'level': 'info' }, { OR: [ { 'source': 'error' }, { 'source': 'warning' } ]}]}}
5: {'filter':{'message': { 'operator': 'LIKE', 'value': '%Proceso%'}}}"
                        ></textarea> 
                    </div>
                    <button id="searchLogsBtn" class="primary-button">Consultar</button>
                    <button id="clearLogsBtn" class="secondary-button">Limpiar</button>
                </div>
            </form>
            <div class="logs-container">
                <div id="logsList">
                </div>
            </div>
        </section>
        `,
  },
  {
    id: 'updatedb',
    label: 'Actualizar DB',
    active: true,
    content: `
    <section class="tab-section updatedb-section">
      <h2>🔄 Actualización de Base de Datos</h2>
      
      <form id="updateDbForm" class="updatedb-form">
        <div class="form-group">
          <label id="version" style="color: ghostwhite;"></label>
          <label for="zipFileInput">📦 Seleccionar archivo ZIP con scripts SQL:</label>
          <input 
            type="file" 
            id="zipFileInput" 
            name="zipFile" 
            accept=".zip"
            required
          />
        </div>
        
        <button type="button" id="uploadBtn" class="upload-button">
          Subir Archivo
        </button>
      </form>

      <div class="progress-container">
        <div class="progress-bar-wrapper">
          <div id="progressBar" class="progress-bar"></div>
          <div id="progressText" class="progress-text">0%</div>
        </div>
      </div>

      <div class="terminal-container">
        <div class="terminal-header">
          <div class="terminal-title">Progreso de Actualización</div>
          <div class="terminal-controls">
            <button id="clearTerminalBtn" class="clear-terminal-btn">Limpiar</button>
          </div>
        </div>
        <div class="terminal-content">
          <div id="terminal"></div>
        </div>
      </div>
    </section>
  `,
  },
];

export async function initializeTabs() {
  const tabList = document.getElementById('tabList');
  const tabContent = document.getElementById('tabContent');

  // Verificar si los elementos del DOM existen
  if (!tabList || !tabContent) {
    console.error('No se encontraron los elementos tabList o tabContent');
    return;
  }

  // Filtrar solo las pestañas activas
  const activeTabs = tabs.filter((tab) => tab.active);

  // Verificar si hay pestañas activas
  if (activeTabs.length === 0) {
    console.warn('No hay pestañas activas para mostrar');
    return;
  }

  // Generar los tabs activos
  activeTabs.forEach((tab) => {
    const li = document.createElement('li');
    li.textContent = tab.label;
    li.dataset.tabId = tab.id;
    li.addEventListener('click', () => switchTab(tab.id));
    tabList.appendChild(li);
  });

  // Mostrar el primer tab activo por defecto
  await switchTab(activeTabs[0].id);
}

async function switchTab(tabId) {
  const tabItems = document.querySelectorAll('#tabList li');
  const tabContent = document.getElementById('tabContent');

  // Actualizar la clase activa en la lista de tabs
  tabItems.forEach((item) => {
    item.classList.toggle('active', item.dataset.tabId === tabId);
  });

  // Actualizar el contenido del tab
  const tab = tabs.find((t) => t.id === tabId);
  if (tab) {
    tabContent.innerHTML = tab.content;

    if (tabId === 'setting') {
      await initializeSettingForm();
    } else if (tabId === 'logs') {
      await initializeLogForm();
    } else if (tabId === 'apis') {
      const apisManager = new ApisManager();
      apisManager.initialize();
    } else if (tabId === 'connectionDb') {
      const connectManager = new ConnectDbsManager();
      connectManager.initialize();
    } else if (tabId === 'updatedb') {
      await initializeUpdateDbForm();
    }
  }
}
