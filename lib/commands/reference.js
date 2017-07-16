var debug = require('debug')('power-merge:commands:reference')
var R = require('ramda')

module.exports = R.curry(function reference(path, context) {

    var view = context.getView(path)

    return function(facts) {
        debug('path: %o, facts: %o', path, facts)
        var result = view(facts)
        debug('return: %o', result)
        return result
    }
})
