var debug = require('debug')('power-merge:commands:unionWith')
var R = require('ramda')

module.exports = R.curry(function unionWith(fn, context) {

    var union = R.unionWith(fn)

    return function(facts) {
        debug('expression: %s, facts: %o', fn.name || 'anon', facts)
        var result = union(facts.a.value, facts.b.value)
        debug('return: %o', result)
        return result
    }
})
