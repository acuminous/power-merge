var debug = require('debug')('power-merge:commands:compose')
var R = require('ramda')

module.exports = R.curry(function compose(commands, context) {

    return function(facts) {
        debug('commands: %o, facts: %o', commands, facts)
        var initialValue = commands.length === 0 ? undefined : facts
        var result = commands.reduce(function(memo, fn) {
            return fn(context)(memo)
        }, initialValue)
        debug('return: %o', result)
        return result
    }
})
