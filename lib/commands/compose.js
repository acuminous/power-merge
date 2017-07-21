var debug = require('debug')('power-merge:commands:compose')

module.exports = function compose(commands) {

    return function(context) {

        var cmds = commands.map(command => command(context))

        return function(facts) {

            debug('commands: %o, facts: %o', commands, facts)
            var initialValue = cmds.length === 0 ? undefined : facts
            var result = cmds.reduce(function(memo, fn) {
                return fn(memo)
            }, initialValue)

            debug('return: %o', result)
            return result
        }
    }
}
