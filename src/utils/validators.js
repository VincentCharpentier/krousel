export function isInstance(value, klass) {
  return value instanceof klass;
}

export function isInteger(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}
