var pm = require('../..')
var R = require('ramda')

module.exports = [
    {
        when: pm.and([
            pm.eq('object', ['a', 'value']),
            pm.eq('object', ['b', 'value']),
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
