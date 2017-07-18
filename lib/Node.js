var R = require('ramda')

module.exports = function(_separator) {

    var path = []

    this.getFacts = function() {
        return {
            depth: path.length,
            path: path.join('.'),
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
