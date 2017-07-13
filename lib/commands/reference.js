var debug = require('debug')('power-merge:commands:reference')

module.exports = function reference(_flags) {

    var flags = _flags || { invert: false }

    return function(a, b) {
        return flags.invert ? b : a
    }
}
