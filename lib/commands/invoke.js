var debug = require('debug')('power-merge:commands:invoke')
var R = require('ramda')

module.exports = function __invoke(fn) {

    return function _invoke(context) {

        return R.is(Function, fn) ? inline : named

        function inline(facts) {
            return invoke(fn.name || 'anon', fn, facts)
        }

        function named(facts) {
            return invoke(fn, context.get('namedCommands')[fn], facts)
        }

        function invoke(name, command, facts) {
            debug('command: %s, facts: %o', command, facts)
            if (!command) throw new Error('No such command: ' + name)
            if (!R.is(Function, command)) throw new Error(name + ' is not a function')
            var result = command(facts)
            debug('return: %o', result)
            return result
        }
    }
}

