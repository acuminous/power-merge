var pm = require('../..')
var cmds = pm.commands
var R = require('ramda')
var citylots = require('./citylots.json')

module.exports = {
    config: {
        api: {
            async: false,
            variadic: false,
            direction: 'left-to-right'
        },
        rules: [
            // Reference arrays of coordinates (too big to clone quickly)
            {
                when: cmds.eq('node.name', 'coordinates'),
                then: cmds.reference('a.value')
            },
            // Recurse into objects
            {
                when: cmds.and([
                    cmds.eq('a.type', 'Object'),
                    cmds.eq('b.type', 'Object')
                ]),
                then: cmds.recurse()
            },
            // Iterate over arrays
            {
                when: cmds.and([
                    cmds.eq('a.type', 'Array'),
                    cmds.eq('b.type', 'Array')
                ]),
                then: cmds.iterate()
            },
            // If the "a" value is undefined, clone the "b" value
            {
                when: cmds.eq('a.value', undefined),
                then: cmds.clone('b.value')
            },
            // Otherwise clone the "a" value
            {
                then: cmds.clone('a.value')
            }
        ]
    },
    data: [
        citylots,
        citylots
    ],
    result: citylots
}

