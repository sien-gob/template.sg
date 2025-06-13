import { getBackendBaseUrl } from '../../../../scripts/config.js';

const API_SETTING_URL = `${getBackendBaseUrl()}/settings`;

export async function loadSetting() {
  let bodyContent = JSON.stringify({
    filter: {
      id: 'setting',
    },
  });

  const response = await fetch(`${API_SETTING_URL}/find`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: bodyContent,
  });

  if (!response.ok) {
    throw new Error('Error al cargar los logs');
  }

  const res = await response.json();
  if (res.status === 'error') {
    throw new Error(data.errors[0].message);
  }

  const client = res.data[0].data.client;
  document.getElementById('setting-clientId').value = client.id || '';
  document.getElementById('setting-client-email').value = client.email.email || '';
  document.getElementById('setting-client-email-pwd').value = client.email.pwd || '';


  const support = res.data[0].data.soporte;
  document.getElementById('setting-support-name').value = support.nombre || '';
  document.getElementById('setting-support-origin').value = support.origin || '';
  document.getElementById('setting-support-email').value = support.email || '';

}

export async function saveSetting(setting) {
  let headersList = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  let bodyContent = JSON.stringify(setting);

  let response = await fetch(`${API_SETTING_URL}/save`, {
    method: 'POST',
    body: bodyContent,
    headers: headersList,
  });

  let res = await response.json();

  if (res.status === 'error') {
    throw new Error(res.errors[0].message);
  }

  return res.data;
}

export async function sendUpdateNotification(data) {
  let headersList = {
    Accept: '*/*',
    'Content-Type': 'application/json',
  };

  let bodyContent = JSON.stringify(data);

  let response = await fetch(`${API_SETTING_URL}/notify-update-app`, {
    method: 'POST',
    body: bodyContent,
    headers: headersList,
  });

  let res = await response.json();

  if (res.status === 'error') {
    throw new Error(res.errors[0].message);
  }

  return res.data;
}
