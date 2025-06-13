export class NotificationManager {
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
    }, 20000);
  }
}
