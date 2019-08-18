module.exports = function formatDate(value) {
  const date = new Date(value);
  const localDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

  return localDate.toLocaleDateString('en-us', {day: 'numeric', month: 'long', year: 'numeric'});
};