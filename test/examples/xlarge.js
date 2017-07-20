var pm = require('../..')
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
                when: pm.eq('node.name', 'coordinates'),
                then: pm.reference('a.value')
            },
            // Recurse into objects
            {
                when: pm.and([
                    pm.eq('a.type', 'Object'),
                    pm.eq('b.type', 'Object')
                ]),
                then: pm.recurse()
            },
            // Iterate over arrays
            {
                when: pm.and([
                    pm.eq('a.type', 'Array'),
                    pm.eq('b.type', 'Array')
                ]),
                then: pm.iterate()
            },
            // If the "a" value is undefined, clone the "b" value
            {
                when: pm.eq('a.value', undefined),
                then: pm.clone('b.value')
            },
            // Otherwise clone the "a" value
            {
                then: pm.clone('a.value')
            }
        ]
    },
    data: [
        citylots,
        citylots
    ],
    result: citylots
}

