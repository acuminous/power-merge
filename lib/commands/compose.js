var debug = require('debug')('power-merge:commands:compose')

module.exports = function compose(commands) {

    return function(context, facts) {

        debug('commands: %o, facts: %o', commands, facts)
        var initialValue = commands.length === 0 ? undefined : facts
        var result = commands.reduce(function(memo, fn) {
            return fn(context, memo)
        }, initialValue)

        debug('return: %o', result)
        return result
    }
}
