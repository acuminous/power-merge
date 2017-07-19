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
            // Error or circular references
            {
                when: pm.and([
                    pm.eq('a.circular', true),
                    pm.eq('b.circular', true)
                ]),
                then: pm.error('Circular reference at {{node.path}}')
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
            // Recurse into objects
            {
                when: pm.and([
                    pm.eq('a.type', 'Object'),
                    pm.eq('b.type', 'Object')
                ]),
                then: pm.recurse()
            },
            // If the "a" value is null, ignore the attribute completely
            {
                when: pm.eq('a.value', null),
                then: pm.ignore()
            },
            // If the "a" value is undefined, clone the "b" value
            {
                when: pm.eq('a.value', undefined),
                then: pm.clone('b.value')
            },
            // Otherwise clone the "a" value
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

