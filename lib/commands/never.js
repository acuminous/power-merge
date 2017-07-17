var debug = require('debug')('power-merge:commands:never')
var R = require('ramda')

module.exports = R.curry(function never(context, facts) {

    debug('facts: %o', facts)
    var result = false

    debug('return: %s', result)
    return result
})
