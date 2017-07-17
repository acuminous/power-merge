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
                    pm.eq('a.type', 'Array'),
                    pm.eq('b.type', 'Array'),
                ]),
                then: pm.compose([
                    pm.unionWith(R.eqBy(R.prop('id'))),
                    pm.invoke(R.sort(function(a, b) {
                        return b.id.localeCompare(a.id)
                    }))
                ])
            },
            {
                then: pm.clone('a.value')
            }
        ]
    },
    data: [
        [ { id: 'a', value: '1.1' } ],
        [ { id: 'a', value: '2.1' }, { id: 'b', value: '2.2' } ],
        [ { id: 'a', value: '3.1' }, { id: 'b', value: '3.2' }, { id: 'c', value: '3.3' } ]
    ],
    result: [
        { id: 'c', value: '3.3' },
        { id: 'b', value: '2.2' },
        { id: 'a', value: '1.1' }
    ]
}
