var debug = require('debug')('power-merge:commands:compose')
var R = require('ramda')

module.exports = function compose(fns) {

    return function(facts) {
        debug('compose: %o %o', fns, facts)
        var initialValue = fns.length === 0 ? undefined : facts
        var result = fns.reduce(function(memo, fn) {
            return fn(memo)
        }, initialValue)
        debug('return: %o', result)
        return result
    }
}
