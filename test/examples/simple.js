var pm = require('../..')

module.exports = [
    {
        when: pm.and([
            pm.odata("a/type eq 'object'"),
            pm.odata("b/type eq 'object'")
        ]),
        then: pm.recurse()
    },
    {
        when: pm.undef(),
        then: pm.clone(['a', 'value'])
    },
    {
        then: pm.clone()
    }
]
