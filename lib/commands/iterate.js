const debug = require('debug')('power-merge:commands:iterate');
const R = require('ramda');
const noop = require('../noop');

module.exports = function __iterate() {

  return function _iterate(context) {

    return function iterate(facts) {

      debug('facts: %o', facts);
      const merge = context.get('merge');
      const a = R.isNil(facts.a.value) ? [] : facts.a.value;
      const b = R.isNil(facts.b.value) ? [] : facts.b.value;
      const result = [];

      debug('depth: %d, len(a): %d, len(b): %d', facts.node.depth, a.length, b.length);
      for (let i = 0; i < Math.max(a.length, b.length); i++) {

        debug('index: %d, a: %o, b: %o', i, a[i], b[i]);
        context.get('node').push(i);
        const value = merge([a[i], b[i]]);
        if (value !== noop) result.push(value);
        context.get('node').pop();
      }

      debug('return: %o', result);
      return result;
    };
  };
};
