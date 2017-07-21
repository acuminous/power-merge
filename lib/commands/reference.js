var debug = require('debug')('power-merge:commands:reference')
var getView = require('../getView')

module.exports = function reference(path, value) {

    var view = getView(path)

    return function(context) {

        return function(facts) {

            debug('path: %o, facts: %o', path, facts)
            var result = view(facts)

            debug('return: %o', result)
            return result
        }
    }
}
