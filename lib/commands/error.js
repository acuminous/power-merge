var debug = require('debug')('power-merge:commands:error')
var hogan = require('hogan.js')
var R = require('ramda')

module.exports = R.curry(function error(template, context) {

    var t = hogan.compile(template)

    return function(facts) {
        debug('error: "%s" %o', template, facts)
        throw new Error(t.render(facts))
    }
})
