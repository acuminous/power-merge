var debug = require('debug')('power-merge:commands:eq')
var getView = require('../getView')

module.exports = function __eq(path, value) {

  var view = getView(path)

  return function _eq(context) {

    return function eq(facts) {

      debug('value: %o, path: %o, facts: %o', value, path, facts)
      var result = view(facts) === value

      debug('return: %s', result)
      return result
    }
  }
}
