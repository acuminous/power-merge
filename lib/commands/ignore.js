var debug = require('debug')('power-merge:commands:ignore')
var R = require('ramda')
var noop = require('../noop')

module.exports = R.curry(function ignore(context) {
    return function(facts) {
        debug('facts: %o', facts)
        return noop
    }
})
