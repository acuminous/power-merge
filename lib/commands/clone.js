var debug = require('debug')('power-merge:commands:clone')
var R = require('ramda')

module.exports = R.curry(function clone(path, context, facts) {

    var view = context.getView(path)

    debug('path: %o, facts: %o', path, facts)
    var result = R.clone(view(facts))

    debug('return: %o', result)
    return result
})
