var debug = require('debug')('power-merge:commands:iterate')
var R = require('ramda')
var noop = require('../noop')

module.exports = function iterate() {

    return function(context) {

        return function(facts) {

            debug('facts: %o', facts)
            var merge = context.get('merge')
            var a = R.isNil(facts.a.value) ? [] : facts.a.value
            var b = R.isNil(facts.b.value) ? [] : facts.b.value
            var result = []

            debug('depth: %d, len(a): %d, len(b): %d', facts.node.depth, a.length, b.length)
            for (var i = 0; i < Math.max(a.length, b.length); i++) {

                debug('index: %d, a: %o, b: %o', i, a[i], b[i])
                context.get('node').push(i)
                var value = merge([a[i], b[i]])
                if (value !== noop) result.push(value)
                context.get('node').pop()
            }

            debug('return: %o', result)
            return result
        }
    }
}
