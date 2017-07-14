var debug = require('debug')('power-merge:commands:union')
var R = require('ramda')

module.exports = function union() {

    return function(facts) {
        debug('union: %o', facts)
        var result = R.union(facts.a.value, facts.b.value)
        debug('return: %o', result)
        return result
    }
}
