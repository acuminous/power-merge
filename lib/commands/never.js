var debug = require('debug')('power-merge:commands:never')

module.exports = function __never() {

  return function _never(context) {

    return function never(facts) {

      debug('facts: %o', facts)
      var result = false

      debug('return: %s', result)
      return result
    }
  }
}
