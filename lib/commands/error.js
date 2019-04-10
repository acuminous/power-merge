var debug = require('debug')('power-merge:commands:error')
var hogan = require('hogan.js')

module.exports = function __error(template) {

  var t = hogan.compile(template)

  return function _error(context) {

    return function error(facts) {
      debug('template: %s, facts: %o', template, facts)
      throw new Error(t.render(facts))
    }
  }
}
