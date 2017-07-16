var debug = require('debug')('power-merge:commands:matches')
var R = require('ramda')

module.exports = function matches(expression, path, context) {
    if (arguments.length === 1) return R.curry(matches)(expression, ['a', 'value'])
    if (arguments.length === 2) return R.curry(matches)(expression, path)

    var view = context.getView(path)
    var regexp = new RegExp(expression)

    return function(facts) {
        debug('expression: %s, path: %o, facts: %o', path, expression, facts)
        var property = view(facts)
        var result = isNothing(property) ? false : regexp.test(property)
        debug('return: %s', result)
        return result
    }

    function isNothing(value) {
        return R.isNil(value) || value === Infinity || isNaN(value)
    }
}
