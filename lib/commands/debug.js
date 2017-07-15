var debug = require('debug')('power-merge:commands:debug')
var hogan = require('hogan.js')
var R = require('ramda')

module.exports = R.curry(function debug(template, log, context) {

    var t = hogan.compile(template)
    var l = log || console.log

    return function(facts) {
        debug('debug: "%s" %o', template, facts)
        l(t.render(facts))
    }
})
