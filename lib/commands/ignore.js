var debug = require('debug')('power-merge:commands:ignore')
var noop = require('../noop')

module.exports = function ignore() {

    return function(context) {

        return function(facts) {
            debug('facts: %o', facts)
            return noop
        }
    }
}
