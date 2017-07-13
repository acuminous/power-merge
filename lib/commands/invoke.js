var debug = require('debug')('power-merge:commands:invoke')
var R = require('ramda')

module.exports = R.curry(function invoke(fn, options, commands) {

    return R.is(Function, fn) ? inline : named

    function inline(facts) {
        return _invoke(fn.name || 'anon', fn, facts)
    }

    function named(facts) {
        return _invoke(fn, commands[fn], facts)
    }

    function _invoke(name, command, facts) {
        debug('invoke: %s(%o)', command, facts)
        if (!command) throw new Error('No such command: ' + name)
        if (!R.is(Function, command)) throw new Error(name + ' is not a function')
        var result = command(facts)
        debug('return: %o', result)
        return result

    }
})

