var debug = require('debug')('power-merge:commands:and')
var R = require('ramda')

module.exports = R.curry(function and(commands, context) {

    return function(facts) {

        debug('commands: %o, facts: %o', commands, facts)
        var result = true
        for (var i = 0; i < commands.length; i++) {
            result = commands[i](context)(facts)
            if (!result) break
        }
        debug('return: %s', result)
        return result
    }
})
