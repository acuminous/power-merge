var debug = require('debug')('power-merge:commands:and')

module.exports = function and(commands) {

    return function(context, facts) {

        debug('commands: %o, facts: %o', commands, facts)
        var result = true
        for (var i = 0; i < commands.length; i++) {
            result = commands[i](context, facts)
            if (!result) break
        }

        debug('return: %s', result)
        return result
    }
}
