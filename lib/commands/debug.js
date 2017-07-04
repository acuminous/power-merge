var debug = require('debug')('power-merge:commands:error')
var hogan = require('hogan.js')

module.exports = function debug(template, log) {

    var t = hogan.compile(template)
    var l = log || console.log

    return function(a, b) {
        debug('debug: "%s" %o %o', template, a, b)
        l(t.render({ a: a, b: b}))
    }
}
