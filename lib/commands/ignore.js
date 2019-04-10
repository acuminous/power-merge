var debug = require('debug')('power-merge:commands:ignore')
var noop = require('../noop')

module.exports = function __ignore() {

  return function _ignore(context) {

    return function ignore(facts) {
      debug('facts: %o', facts)
      return noop
    }
  }
}
