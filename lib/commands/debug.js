var debug = require('debug')('power-merge:commands:debug')
var hogan = require('hogan.js')
var R = require('ramda')
var noop = require('../noop')

module.exports = function debug(template, log, context) {

    if (arguments.length === 1) return R.curry(debug)(template, console.log)
    if (arguments.length === 2) return R.curry(debug)(template, log)

    var t = hogan.compile(template)

    return function(facts) {
        debug('template: %s, facts: %o', template, facts)
        log(t.render(facts))
        return noop
    }
}
