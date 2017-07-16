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
                    pm.eq('Object', 'a.type'),
                    pm.eq('Object', 'b.type')
                ]),
                then: pm.recurse()
            },
            // Union an array of hosts by the 'ip' attribute
            {
                when: pm.and([
                    pm.eq('hosts', 'node.name'),
                    pm.eq('Array', 'a.type'),
                    pm.eq('Array', 'b.type')
                ]),
                then: pm.compose([
                    pm.unionWith(R.eqBy(R.prop('ip'))),
                    pm.invoke(R.sort(function(a, b) {
                        return a.ip.localeCompare(b.ip)
                    }))
                ])
            },
            // If the left value is undefined, clone the right
            {
                when: pm.eq(undefined, 'a.value'),
                then: pm.clone('b.value')
            },
            // Otherwise clone the left
            {
                then: pm.clone()
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
            ]
        },
        {
            poll: {
                delay: '1m',
                frequency: '10s',
            },
            hosts: [
                { ip: '192.168.1.100', port: 8080 },
                { ip: '192.168.1.101', port: 8080 }
            ]
        },
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

