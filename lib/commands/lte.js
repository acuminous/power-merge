var debug = require('debug')('power-merge:commands:lte')
var getView = require('../getView')

module.exports = function __lte(path, value) {

  var view = getView(path)

  return function _lte(context) {

    return function lte(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts)
      var result = view(facts) <= value

      debug('return: %s', result)
      return result
    }
  }
}
