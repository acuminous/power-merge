var pm = require('../..')
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
                when: pm.and([
                    pm.eq('a.circular', true),
                    pm.eq('b.circular', true)
                ]),
                then: pm.error('Circular reference at {{node.path}}')
            },
            {
                when: pm.and([
                    pm.eq('a.type', 'Object'),
                    pm.eq('b.type', 'Object'),
                ]),
                then: pm.recurse()
            },
            {
                when: pm.eq('a.value', undefined),
                then: pm.clone('b.value')
            },
            {
                then: pm.clone('a.value')
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
