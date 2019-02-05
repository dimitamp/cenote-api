const chrono = require('chrono-node');

function isJSON(str) {
  try {
    return (JSON.parse(str) && !!str);
  } catch (e) {
    return false;
  }
}

function applyFilter(filter, results) {
  if (filter.operator === 'ne') {
    results = results.filter(el => el[filter.property_name] !== filter.property_value);
  } else if (filter.operator === 'exists') {
    if (filter.property_value) {
      results = results.filter(el => Object.keys(el).includes(filter.property_name));
    } else {
      results = results.filter(el => !Object.keys(el).includes(filter.property_name));
    }
  } else if (filter.operator === 'in') {
    const tmp = Array.isArray(filter.property_value) ? filter.property_value : [filter.property_value];
    results = results.filter(el => tmp.includes(el[filter.property_name]));
  } else if (filter.operator === 'or') {
    filter.operands.forEach((operand) => {
      if (operand.operator === 'eq') {
        results = results.filter(el => el[operand.property_name] === operand.property_value);
      } else if (operand.operator === 'ne') {
        results = results.filter(el => el[operand.property_name] !== operand.property_value);
      } else if (operand.operator === 'lt') {
        results = results.filter(el => el[operand.property_name] < operand.property_value);
      } else if (operand.operator === 'lte') {
        results = results.filter(el => el[operand.property_name] <= operand.property_value);
      } else if (operand.operator === 'gt') {
        results = results.filter(el => el[operand.property_name] > operand.property_value);
      } else if (operand.operator === 'gte') {
        results = results.filter(el => el[operand.property_name] >= operand.property_value);
      } else if (operand.operator === 'exists') {
        if (operand.property_value) {
          results = results.filter(el => Object.keys(el).includes(operand.property_name));
        } else {
          results = results.filter(el => Object.keys(el).includes(operand.property_name));
        }
      } else if (operand.operator === 'in') {
        const tmp = Array.isArray(operand.property_value) ? operand.property_value : [operand.property_value];
        results = results.filter(el => tmp.includes(el[operand.property_name]));
      }
    });
  }
  return results;
}

function parseTimeframe(relTimeframe) {
  if (typeof relTimeframe !== 'string') return '';
  if (relTimeframe.split('_').length !== 3) return '';
  relTimeframe = relTimeframe.split('_');
  const nlpDate = `${relTimeframe[1]} ${relTimeframe[2]} ago`;
  const now = new Date();
  const jsDate = chrono.parseDate(nlpDate, now);
  return `cenote_timestamp >= '${jsDate.toISOString()}' AND cenote_timestamp ${relTimeframe[0] === 'this' ? '<=' : '<'} '${now.toISOString()}'`;
}

module.exports = { isJSON, applyFilter, parseTimeframe };
