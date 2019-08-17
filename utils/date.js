module.exports = function formatDate(value) {
  const date = new Date(value);
  console.log('incoming date:', value, 'processed js date:', date);

  return date.toLocaleDateString('en-us', {day: 'numeric', month: 'long', year: 'numeric'});
};