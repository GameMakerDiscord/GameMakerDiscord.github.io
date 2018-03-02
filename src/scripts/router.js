/**
 * Push a new hash url
 */
export function navigate(path) {
  window.location.hash = path;
}

/**
 * Get the current hash route without the initial hash and slash
 */
export function getCurrentPath() {
  return window.location.hash.replace(/#\//g, '');
}
