export function isValidHostPort(input) {
  try {
    // Crear objeto URL
    const url = new URL(input);

    // Extraer el host y puerto
    const host = url.hostname;
    const portStr = url.port;

    // Asignar puerto por defecto si no se especifica
    const port = portStr ? parseInt(portStr, 10) : url.protocol === 'https:' ? 443 : 80;

    // Validar el puerto
    if (isNaN(port) || port < 1 || port > 65535) return false;

    // Validar host
    if (host === 'localhost') return true;
    if (/^[\w.-]+$/.test(host)) return true; // Nombre de dominio
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host)) return true; // Dirección IP

    return false;
  } catch (e) {
    return false;
  }
}

export function isValidPort(input) {
  // Validar el puerto
  if (isNaN(port)) return false;
  if (port < 1 || port > 65535) return false;

  return true;
}
