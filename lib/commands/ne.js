var debug = require('debug')('power-merge:commands:ne')
var R = require('ramda')

module.exports = function ne(value, path, context) {

    if (arguments.length === 1) return R.curry(ne)(value, ['a', 'value'])
    if (arguments.length === 2) return R.curry(ne)(value, path)

    var view = context.getView(path)

    return function(facts) {
        debug('value: %o, path: %o, facts: %o', value, path, facts)
        var result = view(facts) !== value
        debug('return: %s', result)
        return result
    }
}
