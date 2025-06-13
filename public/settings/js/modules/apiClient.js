import { NotificationManager } from './logManager.js';

export class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.notification = new NotificationManager();
  }

  async fetch({ endpoint, method = 'POST', body = null, showErrors = true, cache = true }) {
    try {
      const headers = {
        Accept: '*/*',
        ...(body && { 'Content-Type': 'application/json' }),
      };

      const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) }),
        ...(!cache && { cache: 'no-cache' }),
      };

      const noCache = !cache ? `?_=${Date.now()}` : '';

      const response = await fetch(`${this.baseUrl}/${endpoint}${noCache}`, options);

      if (!response.ok) {
        throw new Error(`Error en la petición: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.status === 'error') {
        throw new Error(result.errors[0].message);
      }

      return result;
    } catch (error) {
      if (showErrors) {
        this.notification.show(error.message, 'error');
      }
      throw error;
    }
  }
}
