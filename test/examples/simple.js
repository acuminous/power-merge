var pm = require('../..')
var R = require('ramda')

module.exports = {
    config: {
        async: false,
        variadic: false,
        direction: 'left',
        rules: [
            {
                when: pm.and([
                    pm.eq('Object', ['a', 'type']),
                    pm.eq('Object', ['b', 'type']),
                ]),
                then: pm.recurse()
            },
            {
                when: pm.eq(null),
                then: pm.clone(['b', 'value'])
            },
            {
                when: pm.eq(undefined),
                then: pm.clone(['b', 'value'])
            },
            {
                then: pm.clone()
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
