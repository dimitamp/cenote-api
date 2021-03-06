const chrono = require('chrono-node');

const isJSON = require('./isJSON');

module.exports = (timeframe) => {
  const now = new Date();
  if (isJSON(timeframe)) {
    const time = JSON.parse(timeframe);
    return `WHERE ${new Date(time.start).toISOString() ? `"cenote$timestamp" >= '${new Date(time.start).toISOString()}' AND` : ''
    } "cenote$timestamp" <= '${new Date(time.end || null).toISOString()}'`;
  }
  if (!timeframe || typeof timeframe !== 'string' || timeframe.split('_').length !== 3) return `WHERE "cenote$timestamp" <= '${now.toISOString()}'`;
  timeframe = timeframe.split('_');
  const nlpDate = `${timeframe[1]} ${timeframe[2]} ago`;
  const jsDate = chrono.parseDate(nlpDate, now);
  return `WHERE "cenote$timestamp" >= '${jsDate.toISOString()}' AND "cenote$timestamp" ${timeframe[0] === 'this' ? '<=' : '<'} '${
    now.toISOString()}'`;
};
