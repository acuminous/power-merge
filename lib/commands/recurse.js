var debug = require('debug')('power-merge:commands:recurse')
var R = require('ramda')

module.exports = R.curry(function recurse(options, commands, context) {

    return function(a, b) {
        debug('recurse: %o %o', a, b)
        var merge = context.get()
        var result = {}
        var keys = R.union(Object.keys(a), Object.keys(b))
        for (var i = 0; i <= keys.length; i++) {
            var key = keys[i]
            if (R.has(key, a) && R.has(key, b)) {
                result[key] = merge(a[key], b[key])
            } else if (R.has(key, a)) {
                result[key] = R.clone(a[key])
            } else if (R.has(key, b)) {
                result[key] = R.clone(b[key])
            }
        }
        debug('return: %o', result)
        return result
    }
})
