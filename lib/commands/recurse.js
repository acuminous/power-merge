var debug = require('debug')('power-merge:commands:recurse')
var R = require('ramda')

module.exports = R.curry(function recurse(options, commands, context) {

    return function(facts) {
        debug('recurse: %o', facts)
        var merge = context.get()
        var a = facts.a.value
        var b = facts.b.value
        var result = {}
        var keys = R.union(Object.keys(a), Object.keys(b))
        for (var i = 0; i <= keys.length; i++) {
            var key = keys[i]
            result[key] = merge(a[key], b[key])
        }
        debug('return: %o', result)
        return result
    }
})
