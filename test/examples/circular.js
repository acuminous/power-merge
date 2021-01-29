const pm = require('../..')
const cmds = pm.commands
const rs = pm.ruleSets
const R = require('ramda')

module.exports = {
    config: {
        api: {
            async: false,
            variadic: false,
            direction: 'left-to-right'
        },
        rules: [
            rs.errorOnCircularReference,
            rs.deepClone
        ]
    },
    data: [
        { a: '1.1', b: { a: '1.2.1' } },
        { a: '2.1', b: { a: '2.2.1', b: '2.2.2' }, c: '2.3' },
        { a: '3.1', b: { a: '3.2.1', b: '3.2.2', c: '3.2.3' }, c: '3.3', d: '3.4' }
    ],
    result: {
        a: '1.1',
        b: { a: '1.2.1', b: '2.2.2', c: '3.2.3' },
        c: '2.3',
        d: '3.4'
    }
}
