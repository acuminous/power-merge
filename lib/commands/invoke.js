var R = require('ramda')
var debug = require('debug')('power-merge:commands:invoke')

module.exports = R.curry(function invoke(fn, options, commands) {

    return R.is(Function, fn) ? inline : named

    function inline(a, b) {
        return _invoke(fn.name || 'anon', fn, a, b)
    }

    function named(a, b) {
        return _invoke(fn, commands[fn], a, b)
    }

    function _invoke(name, command, a, b) {
        debug('invoke: %s(%o, %o)', command, a, b)
        if (!command) throw new Error('No such command: ' + name)
        if (!R.is(Function, command)) throw new Error(name + ' is not a function')
        var result = command(a, b)
        debug('return: %o', result)
        return result

    }
})

