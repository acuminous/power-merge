var dbug = require('debug')('power-merge:commands:debug')
var hogan = require('hogan.js')
var noop = require('../noop')

module.exports = function debug(template, log) {

    if (arguments.length === 1) return debug(template, console.log)

    var t = hogan.compile(template)

    return function(context) {

        return function(facts) {
            dbug('template: %s, facts: %o', template, facts)
            log(t.render(facts))
            return noop
        }
    }
}
