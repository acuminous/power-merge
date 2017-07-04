var debug = require('debug')('power-merge:commands:invoke')

module.exports = function invoke(fn) {
    return function(a, b) {
        debug('invoke: %s(%o, %o)', fn.name || 'anon', a, b)
        var result = fn(a, b)
        debug('return: %o', result)
        return result
    }
}

