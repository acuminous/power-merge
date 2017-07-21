var or = require('../commands/or')
var eq = require('../commands/eq')
var error = require('../commands/error')

module.exports = [
    {
        when: or([
            eq('a.circular', true),
            eq('b.circular', true)
        ]),
        then: error('Circular reference at {{node.path}}')
    }
]
