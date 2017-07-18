var debug = require('debug')('power-merge:commands:always')

module.exports = function always() {

    return function(context, facts) {
        debug('facts: %o', facts)
        var result = true

        debug('return: %s', result)
        return result
    }
}
