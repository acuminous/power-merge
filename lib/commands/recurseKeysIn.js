var debug = require('debug')('power-merge:commands:recurseKeysIn')
var R = require('ramda')
var _recurseKeys = require('./internal/recurseKeys')

module.exports = function recurseKeysIn() {

    return function(context) {

        return function(facts) {
            return _recurseKeys(debug, getKeys, context, facts)
        }
    }

    function getKeys(a, b) {
        return R.union(R.keysIn(a), R.keysIn(b))
    }
}
