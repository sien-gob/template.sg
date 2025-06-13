import { NotificationManager } from '../logManager.js';
import { loadSetting, saveSetting, sendUpdateNotification } from './setting.js';

export async function initializeSettingForm() {
  try {
    const form = document.getElementById('settingForm');
    form.addEventListener('submit', handleSubmit);

    await loadSetting();
  } catch (error) {
    const ms = new NotificationManager();
    ms.show(error.message, 'error');
  }
}

async function handleSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const setting = {
    id: 'setting',
    data: {
      client: {
        id: formData.get('setting-clientId'),
        email: {
          email: formData.get('setting-client-email'),
          pwd: formData.get('setting-client-email-pwd'),
        },
      },
      soporte: {
        nombre: formData.get('setting-support-name'),
        origin: formData.get('setting-support-origin'),
        email: formData.get('setting-support-email'),
      },
    },
  };

  const ms = new NotificationManager();
  try {
    const res = await saveSetting(setting);
    ms.show(res.message);
  } catch (error) {
    ms.show(error.message, 'error');
  }
}
