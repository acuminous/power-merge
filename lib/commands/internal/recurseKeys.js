const R = require('ramda');
const noop = require('../../noop');

module.exports = function _recurseKeys(debug, getKeys, context, facts) {

  debug('facts: %o', facts);
  const merge = context.get('merge');
  const a = R.isNil(facts.a.value) ? {} : facts.a.value;
  const b = R.isNil(facts.b.value) ? {} : facts.b.value;
  const result = {};
  const keys = getKeys(a, b);

  debug('depth: %d, keys: %o', facts.node.depth, keys);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];

    debug('key: %s, a: %o, b: %o', key, a[key], b[key]);
    context.get('node').push(key);
    const value = merge([a[key], b[key]]);
    if (value !== noop) result[key] = value;
    context.get('node').pop();
  }

  debug('return: %o', result);
  return result;
};
