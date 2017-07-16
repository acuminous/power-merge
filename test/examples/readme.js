var pm = require('../..')
var R = require('ramda')

module.exports = {
    config: {
        async: false,
        variadic: false,
        direction: 'left',
        rules: [
            // Recurse into objects
            {
                when: pm.and([
                    pm.eq('a.type', 'Object'),
                    pm.eq('b.type', 'Object')
                ]),
                then: pm.recurse()
            },
            // Union an array of hosts by the 'ip' attribute
            {
                when: pm.and([
                    pm.eq('node.name', 'hosts'),
                    pm.eq('a.type', 'Array'),
                    pm.eq('b.type', 'Array')
                ]),
                then: pm.compose([
                    pm.unionWith(R.eqBy(R.prop('ip'))),
                    pm.invoke(R.sort(function(a, b) {
                        return a.ip.localeCompare(b.ip)
                    }))
                ])
            },
            // If the left value is null, ignore the attribute completely
            {
                when: pm.eq('a.value', null),
                then: pm.ignore()
            },
            // If the left value is undefined, clone the right
            {
                when: pm.eq('a.value', undefined),
                then: pm.clone('b.value')
            },
            // Otherwise clone the left
            {
                then: pm.clone('a.value')
            }
        ]
    },
    data: [
        {
            poll: {
                delay: '30s',
                frequency: '5s',
            },
            hosts: [
                { ip: '192.168.1.100', port: 8080 },
                { ip: '192.168.1.200', port: 8080 }
            ],
            timeout: null
        },
        {
            poll: {
                delay: '1m',
                frequency: '10s',
            },
            hosts: [
                { ip: '192.168.1.100', port: 8080 },
                { ip: '192.168.1.101', port: 8080 }
            ],
            timeout: '1m'
        }
    ],
    result: {
        poll: {
            delay: '30s',
            frequency: '5s',
        },
        hosts: [
            { ip: '192.168.1.100', port: 8080 },
            { ip: '192.168.1.101', port: 8080 },
            { ip: '192.168.1.200', port: 8080 }
        ]
    }
}

