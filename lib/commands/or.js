var debug = require('debug')('power-merge:commands:or')

module.exports = function or(commands) {

    return function(context) {

        var cmds = commands.map(command => command(context))

        return function(facts) {

            debug('commands: %o, facts: %o', commands, facts)
            var result = true
            for (var i = 0; i < cmds.length; i++) {
                result = cmds[i](facts)
                if (result) break
            }

            debug('return: %s', result)
            return result
        }
    }
}
