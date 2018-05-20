var debug = require('debug')('power-merge:commands:clone')
var R = require('ramda')
var getView = require('../getView')

module.exports = function __clone(path, value) {

    var view = getView(path)

    return function _clone(context) {

        return function clone(facts) {

            debug('path: %o, facts: %o', path, facts)
            var result = R.clone(view(facts))

            debug('return: %o', result)
            return result
        }
    }
}
