var debug = require('debug')('power-merge:commands:clone')
var R = require('ramda')

module.exports = function clone(_path) {

    var path = _path || ['a', 'value']
    var view = R.view(R.lensPath(path))

    return function(facts) {
        debug('clone: "%s" %o', path, facts)
        var result = R.clone(view(facts))
        debug('return: %o', result)
        return result
    }
}
