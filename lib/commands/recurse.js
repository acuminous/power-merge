var debug = require('debug')('power-merge:commands:recurse')
var R = require('ramda')

module.exports = R.curry(function recurse(context) {

    return function(facts) {
        debug('facts: %o', facts)
        var merge = context.get('merge')
        var a = facts.a.value
        var b = facts.b.value
        var result = {}
        var keys = R.union(Object.keys(a), Object.keys(b))
        debug('depth: %d, keys: %o', facts.depth, keys)
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            context.push('path', key)
            debug('index: %d, key: %s, a: %o , b:%o', i, key, a[key], b[key])
            result[key] = merge([a[key], b[key]])
            context.pop('path')
        }
        debug('return: %o', result)
        return result
    }
})
