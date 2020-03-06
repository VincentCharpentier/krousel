export default function debounce(callback, delay) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(callback, delay, ...args);
  };
}
