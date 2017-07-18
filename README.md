# power-merge

[![NPM version](https://img.shields.io/npm/v/power-merge.svg?style=flat-square)](https://www.npmjs.com/package/power-merge)
[![NPM downloads](https://img.shields.io/npm/dm/power-merge.svg?style=flat-square)](https://www.npmjs.com/package/power-merge)
[![Build Status](https://img.shields.io/travis/cressie176/power-merge/master.svg)](https://travis-ci.org/cressie176/power-merge)
[![Code Style](https://img.shields.io/badge/code%20style-imperative-brightgreen.svg)](https://github.com/cressie176/eslint-config-imperative)
[![Dependency Status](https://david-dm.org/cressie176/power-merge.svg)](https://david-dm.org/cressie176/power-merge)
[![devDependencies Status](https://david-dm.org/cressie176/power-merge/dev-status.svg)](https://david-dm.org/cressie176/power-merge?type=dev)

There are scores of merge libraries for node.js, but they all have hidden assumptions and surprises waiting to catch you out. For example:

Ramda merge unions arrays
```js
R.merge({ a: [1, 2, 3] }, { b: [3, 4, 5] })         // { a: [ 1, 2, 3, 4, 5 ] }
```

Lodash merge mashes (for want of a better word) arrays
```js
_.merge({ a: [1, 2, 3] }, { a: [3, 4, 5, 6] })      // { a: [ 1, 2, 3, 6 ] }
```

But what if I only want the left most array, or if I want the union on both arrays, based on a key? e.g.
```js
merge(
    { hosts: [
        { ip: '192.168.1.100', port: 9090 },
        { ip: '192.168.1.101', port: 9090 }
    ] },
    { hosts: [
        { ip: '192.168.1.100', port: 8080 },
        { ip: '192.168.1.200', port: 8080 }
    ] }
)

// Desired Result
{ hosts: [
    { ip: '192.168.1.100', port: 9090 },
    { ip: '192.168.1.101', port: 9090 },
    { ip: '192.168.1.200', port: 8080 }
] }
```
power-merge puts you in charge of your merge rules, making it easy to specify custom merge behaviour for any property within your documents.

## Caveats
* Depending on how you configure the merge rules (referencing / recursing / cloning), power-merge may be very slow and use considerable system resources when processing large documents

## TL;DR
### 1. Define the rules
```js
const pm = require('power-merge')
const R = require('ramda')

const rules = [
    // Union an array of hosts by the 'ip' attribute
    {
        when: pm.and([
            pm.eq('node.name', 'hosts'),
            pm.eq('a.type', 'Array'),
            pm.eq('b.type', 'Array')
        ]),
        then: pm.unionWith(R.eqBy(R.prop('ip')))
    },
    // Recurse into objects
    {
        when: pm.and([
            pm.eq('a.type', 'Object'),
            pm.eq('b.type', 'Object')
        ]),
        then: pm.recurse()
    },
    // Iterate over arrays
    {
        when: pm.and([
            pm.eq('a.type', 'Array'),
            pm.eq('b.type', 'Array')
        ]),
        then: pm.iterate()
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
```
### 2. Compile the rules
```js
const merge = pm.compile({ rules })
```
### 3. Merge the data    
```js
const a = {
    poll: {
        delay: '30s',
        frequency: '5s',
    },
    hosts: [
        { ip: '192.168.1.100', port: 8080 },
        { ip: '192.168.1.200', port: 8080 }
    ]
}

const b = {
    poll: {
        delay: '1m',
        frequency: '10s',
    },
    hosts: [
        { ip: '192.168.1.100', port: 8080 },
        { ip: '192.168.1.101', port: 8080 }
    ]
}

const result = merge(a, b)
```
### 4. Profit
```js
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

### API
power-merge is intended to be configurable. In addition to the merge rules you can specify

* a synchronous(default) or asynchronous interface.
* whether the merge should be left-to-right(default) or right-to-left
* whether the arguments should be varardic(default) or an array.

```js
var merge = pm.compile({
    api: {
        synchronous: false,
        direction: 'right-to-left',
        varardic: false
    },
    rules: [ ... ]
})

merge([d, c, b, a], function(err, result) {
    // profit
})
```

### Rules
power-merge operates on an array of rules. A rule is comprised of zero or one `when` conditions and exactly one `then` condition. 

```js
const rules = [{
    when: pm.eq('a.value', undefined),
    then: pm.clone('b.value')
}, {
    then: pm.clone('a.value')
}]
```
The `when` conditions are tested in order until one passes, after which the associated `then` condition is invoked. The result of the `then` condition will normally be the merge result, but could be a token to instruct the merge function to skip over the current node instead of merging it.

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
`when` conditions are used to check the facts. If they return true, the `then` condition will be executed. `then` conditions typically reference, clone or descend into the fact's `a.value` and/or `b.value`, but could also be written to perform operations upon any of the facts.

### Context
The context contains information about the current merge. It records the depth, current node name and path. It also contains a reference to the merge function that is used to recursively descend into objects or iterate over arrays. Unless you're writing your own commands, you won't need to know about the context.

### Commands
Commands are the functions which operate on [facts](#facts). You specify them in the `when` and `then` conditions. e.g.

```
{
    when: pm.eq('a.value', 'foo'),
    then: pm.clone('a.value')
}
```
references two commands, `eq` and `clone`. The `eq` command takes two parameters, `path` and `value`. It uses the `path` to extract data from the [facts](#facts) and compares it to the `value`, returning true if they are equal, and false otherwise.

The `clone` takes one parameter, `path`. It clones the data located at the specified`path` and returns it to the merge operation. Several commands are included with power-merge. Others such as [power-merge-odata](https://www.npmjs.org/package/power-merge-odata) are included in separate modules. It is also easy to write your own [custom commands](#custom-commands).

#### always
Always execute the `then` command.
```
{
    when: pm.always(),
    then: pm.clone()
}
```
Since `when` will default to `always`, you can achieve the same result by omitting the `when` clause altogether.

#### and
Boolean AND multiple commands. e.g.
```
{
    when: pm.and([
        pm.eq('a.type', 'String'),
        pm.eq('b.type', 'String')
    ])
}
```

#### clone
Clones the value specified by the [path](#paths) parameter using [Ramda's clone](http://ramdajs.com/docs/#clone) function.
```js
{
    then: pm.clone()
}
```

#### compose
Composes a chain of commands so the output from one will be passed to the next. This is useful post processing tasks such as sorting arrays, e.g.
```js
{
    when: pm.and([
        pm.eq('a.type', 'Array'),
        pm.eq('b.type', 'Array')
    ]),
    then: pm.compose([
        pm.union(),
        pm.invoke(R.sort(function(a, b) {
            return a.localeCompare(b.ip)
        }))
    ])
}
```

#### debug
Useful for debuging output to the consule while developing your merge rules, however use with care since this command will also cause the current node to be omitted from the merged document. The first parameter is a [hogan.js](https://www.npmjs.org/package/hogan.js) template, the second (optional) parameter is a logger in case you want to direct output somewhere other than the console.

```js
{
    then: pm.debug('A: {{value.a}}, B: {{value.b}}')
}
```

#### eq
Compares the value located at the given [path](#paths) with the second parameter, returning true if they are equal and false otherwise

```js
{
    when: pm.eq('a.type', 'Number')
}
```

#### error
Throws an error constructed from the given [hogan.js](https://www.npmjs.org/package/hogan.js) template
```js
{
    then: pm.err('Boom! A: {{value.a}}, B: {{value.b}}')
}
```

#### gt
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is greater and false otherwise
```js
{
    when: pm.gt('a.value', 10)
}
```

#### gte
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is greater or equal and false otherwise
```js
{
    when: pm.gte('a.value', 10)
}
```

#### ignore
Ignores a part of the document, e.g.
```js
{
    when: pm.eq('a.value', 'do-not-want')
    then: pm.ignore()
}
```

#### invoke
Invokes a named or inline function.
```js
var options = {
    rules: [
        // inline
        {
            when: pm.invoke(function(facts) {
                return facts.value.a === 'yes'
            }),
            then: pm.invoke(function(facts) {
                return true
            })
        },
        // named
        {
            when: pm.invoke('yes'),
            then: pm.invoke('truism')
        }
    ]
}
var merge = pm.compile(options, {
    yes: function(facts) {
        return facts.value.a === 'yes'
    }),
    truism: function(facts) {
        return true
    }
})
```

#### iterate
Iterates over two arrays, merging each item. If the arrays are different lengths, overflowing items will be merged against undefined.
```js
{
    when: pm.and([
        pm.eq('a.type', 'Array'),
        pm.eq('b.type', 'Array')
    ]),
    then: pm.iterate()
}
```

#### lt
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is less and false otherwise
```js
{
    when: pm.gt('a.value', 10)
}
```

#### lte
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is less or equal and false otherwise
```js
{
    when: pm.gte('a.value', 10)
}
```

#### matches
Tests the value located at the given [path](#paths) against a regex.
```js
{
    when: pm.matches('a.value', /foo/i)
}
```

#### ne
Compares the value located at the given [path](#paths) with the second parameter, returning false if they are equal and true otherwise

```js
{
    when: pm.eq('a.type', 'Number')
}
```

#### never
Never execute the `then` command.
```
{
    when: pm.never(),
    then: pm.clone()
}
```
Only useful for tests or to temporarily disable a rule.

#### or
Boolean OR multiple commands. e.g.
```
{
    when: pm.or([
        pm.eq('a.type', 'String'),
        pm.eq('a.type', 'Number')
    ])
}
```

#### recurse
Recursively merge the attributes of "a" and "b". Only sensible when both "a" and "b" are objects (use the [iterate](#iterate) command to recurively merge two arrays).
```
{
    when: pm.and([
        pm.eq('a.type', 'Object'),
        pm.eq('b.type', 'Object')
    ]),
    then: pm.recurse()
}
```

#### reference
References the value specified by the [path](#paths) parameter.
```js
{
    then: pm.reference('a.value')
}
```

#### union
Union the "a" and "b" values using [Ramda's union](http://ramdajs.com/docs/#lensPath) function (which also dedupes). Only sensible when both "a" and "b" are arrays.
```js
{
    when: pm.and([
        pm.eq('a.type', 'Array'),
        pm.eq('b.type', 'Array')
    ]),
    then: pm.union()
}
```

#### unionWith
Union the "a" and "b" values using [Ramda's unionWith](http://ramdajs.com/docs/#lensPath) function (which dedupes based on the result of the given function). Only sensible when both "a" and "b" are arrays.
```js
{
    when: pm.and([
        pm.eq('a.type', 'Array'),
        pm.eq('b.type', 'Array')
    ]),
    then: pm.unionWith(function(v) {
        return v.id
    })
}
```

### Custom Commands
power-merge commands are easy to write, once you understand that they must be expressed as a function that returns a function. The outer function takes the command's configuration parameters, the inner function takes the [context](#context) and [facts](#facts), e.g.

```js
var debug = require('debug')('power-merge:commands:highlight')

module.exports = function highlight(str) {

    return function(context, facts) {

        debug('path: %o, facts: %o', path, facts)
        var result = str + view(facts) + str

        debug('return: %o', result)
        return result
    }
})
```
Commands that should cause an attribute to be ignored, rather than merged should return the special `pm.noop` token. i.e.

```js
var debug = require('debug')('power-merge:commands:log')
var noop = require('pm').noop

module.exports = function log(text) {

    return function(context, facts) {
        debug('path: %o, facts: %o', path, facts)
        console.log(text)
        return noop
    }
})
```
Unless you need to do some expensive setup such as compiling templates, the above can be simplified by currying...

```js
var debug = require('debug')('power-merge:commands:highlight')
var R = require('ramda')

module.exports = R.curry(function highlight(str, context, facts) {

    debug('path: %o, facts: %o', path, facts)
    var result = str + view(facts) + str

    debug('return: %o', result)
    return result
})
```
Even without expensive setup, currying does have incur a minor performance penalty. It can also make it harder to realise you've forgotten to pass one of the configuration parameters to the command.

### Paths
Several of the bundled commands take a `path` parameter to locate a value within the [facts](#facts). In the readme and examples this is always expressed as a dotpath, e.g. `a.value`, however under the hood this is converted to an array ['a', 'value'], which is passed to [Ramda's lensPath](http://ramdajs.com/docs/#lensPath) function. If you can't use dots in your path for any reason, you can pass in an array or use the power-merge `pathSeparator` option to change the separator, e.g.

```js
var merge = pm.compile({ pathSeparator: '/', rules: [
    when: pm.eq('a/value', 'foo'),
    then: pm.ignore()
]})
```

### Debugging
power-merge uses [debug](https://www.npmjs.org/package/debug). You can enable as follows...
```
DEBUG='power-merge:*' node your-application.js
```
