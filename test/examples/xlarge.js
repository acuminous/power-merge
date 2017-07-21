var pm = require('../..')
var cmds = pm.commands
var rs = pm.ruleSets
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
            rs.base
        ]
    },
    data: [
        citylots,
        citylots
    ],
    result: citylots
}

