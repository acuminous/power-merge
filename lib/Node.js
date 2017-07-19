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

    this.push = function(name) {
        path.push(name)
    }

    this.pop = function() {
        return path.pop()
    }
}
