var debug = require('debug')('power-merge:commands:clone')
var R = require('ramda')

module.exports = R.curry(function clone(path, context) {

    var view = context.getView(path)

    return function(facts) {
        debug('path: %o, facts: %o', path, facts)
        var result = R.clone(view(facts))
        debug('return: %o', result)
        return result
    }
})
