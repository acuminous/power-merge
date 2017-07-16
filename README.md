# power-merge
There are scores of merge libraries for node.js, but they all have hidden assumptions and surprises waiting to catch you out. For example:

1. Ramda merge unions arrays
    ```
    R.merge({ a: [1, 2, 3] }, { b: [3, 4, 5] })
    // Output
    { a: [ 1, 2, 3, 4, 5 ] }
    ```

1. Lodash merge mashes (for want of a better word) arrays
    ```
    _.merge({ a: [1, 2, 3] }, { a: [3, 4, 5, 6] })
    // Output
    { a: [ 1, 2, 3, 6 ] }
    ```

There are situations when the above behaviour wont do. What happens if I only want the left most array, or if I want the union on both arrays, based on a key? e.g.
```
merge(
    { hosts: [
        { ip: '192.168.1.100' },
        { ip: '192.168.1.101' }
    ] },
    { hosts: [
        { ip: '192.168.1.100' },
        { ip: '192.168.1.200' }
    ] }
)
// Output
{ hosts: [
    { ip: '192.168.1.100' },
    { ip: '192.168.1.101' },
    { ip: '192.168.1.200' }
] }
```
power-merge puts you in charge of your merge rules, making it easy to specify custom merge behaviour for any property within your documents.

## tldr;
```js
const pm = require('power-merge')
const R = require('ramda')


const config = {
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
            then: pm.unionWith(R.eqBy(R.prop('ip')))
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
})

const merge = pm.compile({ config })

var defaults = {
    poll: {
        delay: '1m',
        frequency: '10s',
    },
    hosts: [
        { ip: '192.168.1.100', port: 8080 },
        { ip: '192.168.1.101', port: 8080 }
    ]
}

var custom = {
    poll: {
        delay: '30s',
        frequency: '5s',
    },
    hosts: [
        { ip: '192.168.1.100', port: 8080 },
        { ip: '192.168.1.200', port: 8080 }
    ]
}

console.log(merge(defaults, custom))
{
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
```

## Facts

## Commands

### Always
Always execute the `then` command.
```
{
    when: pm.always(),
    then: pm.clone()
}
```
Since `when` will default to `always`, you can achieve the same result by omitting the `when` clause altogether.

### And
Boolean AND for combining multiple commands.
```
{
    when: pm.and([
        pm.eq('String', ['a', 'type']),
        pm.eq('String', ['b', 'type']),
    ]),
    then: pm.clone()
}
```
### Clone

