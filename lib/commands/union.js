const debug = require('debug')('power-merge:commands:union');
const R = require('ramda');

module.exports = function __union() {

  return function _union() {

    return function union(facts) {

      debug('facts: %o', facts);
      const result = R.union(facts.a.value, facts.b.value);

      debug('return: %o', result);
      return result;
    };
  };
};
