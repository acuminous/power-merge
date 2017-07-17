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

But what if I only want the left most array, or if I want the union on both arrays, based on a key? e.g.
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
        // If the "a" value is null, ignore the attribute altogether
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
})

const merge = pm.compile({ config })

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

console.log(merge(custom, defaults))

// Output
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

## How power-merge works

### Facts
Facts is a document are passed to each `when` and `then` condition. The facts are...

```js
{
    a: {
        value: '30s',
        type: 'String'
    },
    b: {
        value: '1m',
        type: 'String'
    },
    node: {
        depth: 3,
        name: 'delay',
        path: 'poll.delay'
    }
```
'when' conditions are used to check the facts. If they return true, the `then` condition will be executed. `then` conditions typically reference, clone or descend into the facts a and/or b values, but could also be written to perform operations upon any of the facts)

### Context
The context contains information about the current merge. It records the depth, current node name and path. It also contains a reference to the merge function that is used to recursively descend into objects or iterate over arrays. Unless you're writing your own commands, you won't need to know about the context.

### Commands
Commands are the functions which operate on facts. You specify them in the `when` and `then` conditions. e.g.

```
{
    when: pm.eq('a.value', 'foo'),
    then: pm.clone('a.value')
}
```
references two commands, `eq` and `clone`. The `eq` command takes two parameters, `path` and `value`. It uses the `path` to extract data from the facts and compares it to the `value`, returning true if they are equal, and false otherwise.

The `clone` takes one parameter, `path`. It clones the data located at the specified`path` and returns it to the merge operation. Several commands are included with power-merge. Others such as [power-merge-odata](npmjs.org/package/power-merge-odata] are included in separate modules. It is also easy to write your own [custom commands](#custom-commands).

#### Always
Always execute the `then` command.
```
{
    when: pm.always(),
    then: pm.clone()
}
```
Since `when` will default to `always`, you can achieve the same result by omitting the `when` clause altogether.

#### And
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
#### Clone


#### Custom Commands
power-merge commands are easy to write, once you understand that they must be expressed as a function that returns a function. The outer function takes the command's configuration parameters, the inner function takes the context and facts, e.g.

```js
var debug = require('debug')('power-merge:commands:stars')

module.exports = function stars(path) {

    return function(context, facts) {

        var view = context.getView(path)

        debug('path: %o, facts: %o', path, facts)
        var result = '***' + view(facts) + '***'

        debug('return: %o', result)
        return result
    }
})
```
Unless you need to do some expensive setup such as compiling templates, the above can be simplified by currying...

```js
var debug = require('debug')('power-merge:commands:stars')
var R = require('ramda')

module.exports = R.curry(function stars(path, context, facts) {

    var view = context.getView(path)

    debug('path: %o, facts: %o', path, facts)
    var result = '***' + view(facts) + '***'

    debug('return: %o', result)
    return result
})

```
Commands that should cause an attribute to be ignored, rather than merged should return the special `pm.noop` token. i.e.

```js
var debug = require('debug')('power-merge:commands:ignore')
var R = require('ramda')
var pm = require('pm')

module.exports = R.curry(function ignore(context, facts) {
    debug('facts: %o', facts)
    return pm.noop
})
```
