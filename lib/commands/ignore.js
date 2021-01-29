const debug = require('debug')('power-merge:commands:ignore');
const noop = require('../noop');

module.exports = function __ignore() {

  return function _ignore() {

    return function ignore(facts) {
      debug('facts: %o', facts);
      return noop;
    };
  };
};
