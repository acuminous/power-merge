var pm = require('../..')
var cmds = pm.commands
var rs = pm.ruleSets
var R = require('ramda')

module.exports = {
    config: {
        api: {
            async: false,
            variadic: false,
            direction: 'left-to-right'
        },
        rules: [
            // Union an array of hosts by the 'ip' attribute
            {
                when: cmds.and([
                    cmds.eq('node.name', 'hosts'),
                    cmds.eq('a.type', 'Array'),
                    cmds.eq('b.type', 'Array')
                ]),
                then: cmds.compose([
                    cmds.unionWith(R.eqBy(R.prop('ip'))),
                    cmds.invoke(R.sort(function(a, b) {
                        return a.ip.localeCompare(b.ip)
                    }))
                ])
            },
            rs.ignoreNull,
            rs.base
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

