var dbug = require('debug')('power-merge:commands:debug')
var hogan = require('hogan.js')
var noop = require('../noop')

module.exports = function __debug(template, log) {

    if (arguments.length === 1) return __debug(template, console.log)

    var t = hogan.compile(template)

    return function _debug(context) {

        return function debug(facts) {
            dbug('template: %s, facts: %o', template, facts)
            log(t.render(facts))
            return noop
        }
    }
}
