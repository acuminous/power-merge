var debug = require('debug')('power-merge:commands:odata')
var client = require('odata-v4-inmemory')

module.exports = function odata(expression) {

    var filter = client.compileExpression(expression)

    return function(context, facts) {
        debug('expression: %s, facts: %o', expression, facts)
        var result = filter(facts)

        debug('return: %s', result)
        return result
    }
}
