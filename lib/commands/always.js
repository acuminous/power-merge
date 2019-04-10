var debug = require('debug')('power-merge:commands:always')

module.exports = function __always() {

  return function _always(context) {

    return function always(facts) {
      debug('facts: %o', facts)
      var result = true

      debug('return: %s', result)
      return result
    }
  }
}
