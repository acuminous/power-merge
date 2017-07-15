var debug = require('debug')('power-merge:commands:always')
var R = require('ramda')

module.exports = R.curry(function always(context) {

    return function(facts) {
        debug('facts: %o', facts)
        var result = true
        debug('return: %s', result)
        return result
    }
})
