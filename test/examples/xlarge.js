const pm = require('../..')
const cmds = pm.commands
const rs = pm.ruleSets
const R = require('ramda')
const citylots = require('./citylots.json')

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
            rs.deepClone
        ]
    },
    data: [
        citylots,
        citylots
    ],
    result: citylots
}
