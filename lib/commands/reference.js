var debug = require('debug')('power-merge:commands:reference')
var R = require('ramda')

module.exports = function reference(path, context) {

    if (arguments.length === 0) return R.curry(reference)(['a', 'value'])
    if (arguments.length === 1) return R.curry(reference)(path)

    var view = context.getView(path)

    return function(facts) {
        debug('path: %o, facts: %o', path, facts)
        var result = view(facts)
        debug('return: %o', result)
        return result
    }
}
