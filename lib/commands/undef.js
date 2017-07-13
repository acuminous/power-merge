var debug = require('debug')('power-merge:commands:undef')
var R = require('ramda')

module.exports = function undef(_path) {
    var path = _path || ['a', 'value']
    var view = R.view(R.lensPath(path))

    return function(facts) {
        debug('undef: "%s" %o', path, facts)
        var property = view(facts)
        var result = property === undefined
        debug('return: %s', result)
        return result
    }
}
