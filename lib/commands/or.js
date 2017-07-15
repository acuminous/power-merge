var debug = require('debug')('power-merge:commands:or')
var R = require('ramda')

module.exports = R.curry(function or(commands, context) {

    return function(facts) {
        debug('commands: %o, facts: %o', commands, facts)
        var result = true
        for (var i = 0; i < commands.length; i++) {
            result = commands[i](context)(facts)
            if (result) break
        }
        debug('return: %s', result)
        return result
    }
})
