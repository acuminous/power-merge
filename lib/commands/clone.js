var debug = require('debug')('power-merge:commands:clone')
var R = require('ramda')

module.exports = function clone(path, context) {

    if (arguments.length === 0) return R.curry(clone)(['a', 'value'])
    if (arguments.length === 1) return R.curry(clone)(path)

    var view = R.view(R.lensPath(context.toArray(path)))

    return function(facts) {
        debug('path: %o, facts: %o', path, facts)
        var result = R.clone(view(facts))
        debug('return: %o', result)
        return result
    }
}
