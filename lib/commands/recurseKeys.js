var debug = require('debug')('power-merge:commands:recurseKeys')
var R = require('ramda')
var internalRecurseKeys = require('./internal/recurseKeys')

module.exports = function __recurseKeys() {

    return function _recurseKeys(context) {

        return function recurseKeys(facts) {
            return internalRecurseKeys(debug, getKeys, context, facts)
        }
    }

    function getKeys(a, b) {
        return R.union(Object.keys(a), Object.keys(b))
    }
}
