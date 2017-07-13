var debug = require('debug')('power-merge:commands:matches')
var R = require('ramda')

module.exports = function matches(expression, _path) {
    var path = _path || ['a', 'value']
    var view = R.view(R.lensPath(path))
    var regexp = new RegExp(expression)

    return function(facts) {
        debug('matches: "%s" "%s" %o', path, expression, facts)
        var property = view(facts)
        if (isNothing(property)) return false
        var result = regexp.test(property)
        debug('return: %s', result)
        return result
    }

    function isNothing(value) {
        return R.isNil(value) || value === Infinity || isNaN(value)
    }
}
