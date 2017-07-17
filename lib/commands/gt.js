var debug = require('debug')('power-merge:commands:gt')
var R = require('ramda')

module.exports = R.curry(function gt(path, value, context, facts) {

    var view = context.getView(path)

    debug('value: %o, path: %o, facts: %o', value, path, facts)
    var result = view(facts) > value

    debug('return: %s', result)
    return result
})
