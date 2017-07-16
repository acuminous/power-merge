var debug = require('debug')('power-merge:commands:recurse')
var R = require('ramda')
var noop = require('../noop')

module.exports = R.curry(function recurse(context) {

    return function(facts) {
        debug('facts: %o', facts)
        var merge = context.get('merge')
        var a = facts.a.value
        var b = facts.b.value
        var result = {}
        var keys = R.union(Object.keys(a), Object.keys(b))
        debug('depth: %d, keys: %o', facts.node.depth, keys)
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]
            var node = context.get('node')
            node.push(key)
            debug('index: %d, key: %s, a: %o , b:%o', i, key, a[key], b[key])
            var value = merge([a[key], b[key]])
            if (value !== noop) result[key] = value
            node.pop()
        }
        debug('return: %o', result)
        return result
    }
})
