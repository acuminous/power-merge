const debug = require('debug')('power-merge:commands:never');

module.exports = function __never() {

  return function _never() {

    return function never(facts) {

      debug('facts: %o', facts);
      const result = false;

      debug('return: %s', result);
      return result;
    };
  };
};
