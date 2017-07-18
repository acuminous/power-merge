var debug = require('debug')('power-merge:commands:never')

module.exports = function never() {

    return function(context, facts) {

        debug('facts: %o', facts)
        var result = false

        debug('return: %s', result)
        return result
    }
}
