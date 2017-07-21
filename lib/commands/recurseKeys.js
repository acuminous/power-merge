var debug = require('debug')('power-merge:commands:recurseKeys')
var R = require('ramda')
var noop = require('../noop')

module.exports = function recurseKeys() {

    return function(context, facts) {

        debug('facts: %o', facts)
        var merge = context.get('merge')
        var a = R.isNil(facts.a.value) ? {} : facts.a.value
        var b = R.isNil(facts.b.value) ? {} : facts.b.value
        var result = {}
        var keys = R.union(Object.keys(a), Object.keys(b))

        debug('depth: %d, keys: %o', facts.node.depth, keys)
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i]

            debug('key: %s, a: %o, b: %o', key, a[key], b[key])
            context.get('node').push(key)
            var value = merge([a[key], b[key]])
            if (value !== noop) result[key] = value
            context.get('node').pop()
        }

        debug('return: %o', result)
        return result
    }
}
