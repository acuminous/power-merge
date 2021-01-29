const debug = require('debug')('power-merge:commands:always');

module.exports = function __always() {

  return function _always() {

    return function always(facts) {
      debug('facts: %o', facts);
      const result = true;

      debug('return: %s', result);
      return result;
    };
  };
};
