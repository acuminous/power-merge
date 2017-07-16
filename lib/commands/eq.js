var debug = require('debug')('power-merge:commands:eq')
var R = require('ramda')

module.exports = R.curry(function eq(path, value, context) {

    var view = context.getView(path)

    return function(facts) {
        debug('value: %o, path: %o, facts: %o', value, path, facts)
        var result = view(facts) === value
        debug('return: %s', result)
        return result
    }
})
