var debug = require('debug')('power-merge:commands:eq')
var R = require('ramda')

module.exports = function eq(value, path, context) {

   if (arguments.length === 1) return R.curry(eq)(value, ['a', 'value'])
   if (arguments.length === 2) return R.curry(eq)(value, path)

    var view = R.view(R.lensPath(path))

    return function(facts) {
        debug('eq: %o "%s" %o', value, path, facts)
        var result = view(facts) === value
        debug('return: %s', result)
        return result
    }
}
