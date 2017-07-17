var debug = require('debug')('power-merge:commands:union')
var R = require('ramda')

module.exports = R.curry(function union(context, facts) {

    debug('facts: %o', facts)
    var result = R.union(facts.a.value, facts.b.value)

    debug('return: %o', result)
    return result
})
