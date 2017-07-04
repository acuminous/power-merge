var debug = require('debug')('power-merge:commands:test')

module.exports = function test(fn) {
    return function(facts) {
        debug('test: %s(%o)', fn.name || 'anon', facts)
        var result = !!fn(facts)
        debug('return: %s', result)
        return result
    }
}
