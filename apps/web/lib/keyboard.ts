export function getKeyboardShortcut() {
  if (typeof window === 'undefined') return { isMac: true };

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  return { isMac };
}
