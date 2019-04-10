var debug = require('debug')('power-merge:commands:gte')
var getView = require('../getView')

module.exports = function __gte(path, value) {

  var view = getView(path)

  return function _gte(context) {

    return function gte(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts)
      var result = view(facts) >= value

      debug('return: %s', result)
      return result
    }
  }
}
