const debug = require('debug')('power-merge:commands:unionWith');
const R = require('ramda');

module.exports = function __unionWith(fn) {

  const union = R.unionWith(fn);

  return function _unionWith() {

    return function unionWith(facts) {
      debug('expression: %s, facts: %o', fn.name || 'anon', facts);
      const result = union(facts.a.value, facts.b.value);
      debug('return: %o', result);
      return result;
    };
  };
};
