export function formatDate(value, options = { year: 'numeric', month: 'short', day: 'numeric' }) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', options).format(date);
}
