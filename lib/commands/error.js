var debug = require('debug')('power-merge:commands:error')
var hogan = require('hogan.js')

module.exports = function error(template) {

    var t = hogan.compile(template)

    return function(a, b) {
        debug('error: "%s" %o %o', template, a, b)
        throw new Error(t.render({ a: a, b: b}))
    }
}
