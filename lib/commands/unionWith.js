var debug = require('debug')('power-merge:commands:unionWith')
var R = require('ramda')

module.exports = function unionWith(fn) {

    var union = R.unionWith(fn)

    return function(facts) {
        debug('unionWith: "%s" %o', fn.name || 'anon', facts)
        var result = union(facts.a.value, facts.b.value)
        debug('return: %o', result)
        return result
    }
}
