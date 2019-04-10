var debug = require('debug')('power-merge:commands:gt')
var getView = require('../getView')

module.exports = function __gt(path, value) {

  var view = getView(path)

  return function _gt(context) {

    return function gt(facts) {
      debug('value: %o, path: %o, facts: %o', value, path, facts)
      var result = view(facts) > value

      debug('return: %s', result)
      return result
    }
  }
}
