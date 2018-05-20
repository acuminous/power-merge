var debug = require('debug')('power-merge:commands:ne')
var getView = require('../getView')

module.exports = function __ne(path, value) {

    var view = getView(path)

    return function _ne(context) {

        return function ne(facts) {

            debug('value: %o, path: %o, facts: %o', value, path, facts)
            var result = view(facts) !== value

            debug('return: %s', result)
            return result
        }
    }
}
