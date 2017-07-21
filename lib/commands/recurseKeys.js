var debug = require('debug')('power-merge:commands:recurseKeys')
var R = require('ramda')
var _recurseKeys = require('./internal/recurseKeys')

module.exports = function recurseKeys() {

    return function(context) {

        return function(facts) {
            return _recurseKeys(debug, getKeys, context, facts)
        }
    }

    function getKeys(a, b) {
        return R.union(Object.keys(a), Object.keys(b))
    }
}
