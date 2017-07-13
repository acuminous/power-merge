var debug = require('debug')('power-merge:commands:and')
var R = require('ramda')

module.exports = function and(commands) {

    return function(facts) {
        debug('and: %o %o', commands, facts)
        var result = true
        for (var i = 0; i < commands.length; i++) {
            result = commands[i](facts)
            if (!result) break
        }
        debug('return: %s', result)
        return result
    }
}
