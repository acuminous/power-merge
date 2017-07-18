var debug = require('debug')('power-merge:commands:matches')
var R = require('ramda')
var getView = require('../getView')

module.exports = function matches(path, expression) {

    var regexp = new RegExp(expression)
    var view = getView(path)

    return function(context, facts) {

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
