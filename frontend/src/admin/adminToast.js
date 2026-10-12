// Tiny toast notifications for the admin panel.
// Call toast('Saved!') or toast('Something failed', 'error') from anywhere; <AdminToaster /> renders them.
const listeners = new Set();
let nextId = 1;

export const toast = (message, type = 'success') => {
  const item = { id: nextId++, message, type };
  listeners.forEach(fn => fn(item));
};

export const subscribeToasts = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};
