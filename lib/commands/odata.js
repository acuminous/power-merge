var debug = require('debug')('power-merge:commands:odata')
var client = require('odata-v4-inmemory')
var R = require('ramda')

module.exports = R.curry(function odata(expression, context) {

    var filter = client.compileExpression(expression)

    return function(facts) {
        debug('expression: %s, facts: %o', expression, facts)
        var result = filter(facts)
        debug('return: %s', result)
        return result
    }
})
