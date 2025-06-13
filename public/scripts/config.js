export const IP = 'localhost:4001';
//const IP = '187.157.39.6:8003';
export const getWsNotificationUrl = () => `http://localhost:5000`;
export const getBackendBaseUrl = () => `http://${IP}/template`;
export const getBackendSettingsFilesUrl = () => `http://${IP}/settings/files`;

export function generateId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}
