var pm = require('../..')
var cmds = pm.commands
var R = require('ramda')

module.exports = {
    config: {
        api: {
            async: false,
            variadic: false,
            direction: 'left-to-right'
        },
        rules: [
            {
                when: cmds.or([
                    cmds.eq('a.circular', true),
                    cmds.eq('b.circular', true)
                ]),
                then: cmds.error('Circular reference at {{node.path}}')
            },
            {
                when: cmds.and([
                    cmds.eq('a.type', 'Object'),
                    cmds.eq('b.type', 'Object'),
                ]),
                then: cmds.recurse()
            },
            {
                when: cmds.eq('a.value', undefined),
                then: cmds.clone('b.value')
            },
            {
                then: cmds.clone('a.value')
            }
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
