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
                    pm.eq('Array', ['a', 'type']),
                    pm.eq('Array', ['b', 'type']),
                ]),
                then: pm.compose([
                    pm.unionWith(R.eqBy(R.prop('id'))),
                    pm.invoke(R.sort(function(a, b) {
                        return b.id.localeCompare(a.id)
                    }))
                ])
            },
            {
                then: pm.clone()
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
