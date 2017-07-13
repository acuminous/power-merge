var debug = require('debug')('power-merge:commands:eq')
var R = require('ramda')

module.exports = function eq(value, _path) {

    var path = _path || ['a', 'value']
    var view = R.view(R.lensPath(path))

    return function(facts) {
        debug('eq: %o "%s" %o', value, path, facts)
        var result = view(facts) === value
        debug('return: %s', result)
        return result
    }
}
