var R = require('ramda')

module.exports = function(_separator) {

    var separator = _separator || '.'
    var path = []

    this.toArray = function(value) {
        if (R.type(value) === 'Array') return value
        if (R.type(value) === 'String') return value.split(separator)
        return [value]
    }

    this.getFacts = function() {
        return {
            depth: path.length,
            path: path.join(separator),
            name: R.last(path)
        }
    }

    this.push = function(node) {
        path.push(node)
    }

    this.pop = function(node) {
        return path.pop()
    }
}
