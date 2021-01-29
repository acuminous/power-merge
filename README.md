# ⚡ Power Merge ⚡

[![NPM version](https://img.shields.io/npm/v/power-merge.svg?style=flat-square)](https://www.npmjs.com/package/power-merge)
[![NPM downloads](https://img.shields.io/npm/dm/power-merge.svg?style=flat-square)](https://www.npmjs.com/package/power-merge)
[![Node.js CI](https://github.com/acuminous/power-merge/workflows/Node.js%20CI/badge.svg)](https://github.com/acuminous/power-merge/actions?query=workflow%3A%22Node.js+CI%22)
[![Code Climate](https://codeclimate.com/github/acuminous/power-merge/badges/gpa.svg)](https://codeclimate.com/github/acuminous/power-merge)
[![Test Coverage](https://codeclimate.com/github/acuminous/power-merge/badges/coverage.svg)](https://codeclimate.com/github/acuminous/power-merge/coverage)
[![Code Style](https://img.shields.io/badge/code%20style-imperative-brightgreen.svg)](https://github.com/acuminous/eslint-config-imperative)
[![Dependency Status](https://david-dm.org/acuminous/power-merge.svg)](https://david-dm.org/acuminous/power-merge)
[![devDependencies Status](https://david-dm.org/acuminous/power-merge/dev-status.svg)](https://david-dm.org/acuminous/power-merge?type=dev)

power-merge is a library for custom merging of two or more documents. If your merge requirments are simple and you are happy with how [Ramda's mergeDeepLeft](http://ramdajs.com/docs/#mergeDeepLeft) or [Lodash's merge](https://lodash.com/docs/4.17.4#merge) works with regard to:

* arrays
* null values
* undefined values
* inherited properties
* non enumerable properties
* functions
* regular expressions
* dates
* objects with a clone function, e.g. [moment.clone](https://momentjs.com/docs/#/parsing/moment-clone/)
* circular references
* mutability

then you're probably better off using one of those libraries. They will be faster, use fewer system resources and are heavily battle tested. However it your merge requirements are somewhat bespoke, then you've come to the right place.

## TL;DR
```js
const pm = require('power-merge')
const { ignoreNull, deepClone } = pm.ruleSets

// Compile the rules
const merge = pm.compile({ rules: [ ignoreNull, deepClone ] })

// Define the documents
const a = {
  poll: {
    delay: null,
    frequency: '5s'
  }
}

const b = {
  poll: {
    delay: '1m',
    frequency: '10s'
  }
}

// Merge the documents
const result = merge(a, b)
```
#### Result:
```
{
  poll: {
    frequency: '5s',
  }
}
```

## But wait, there's more...
A rules driven merge libary wouldn't be much use if you couldn't compose your own rules. Here's how...

```js
const pm = require('power-merge')
const { ignoreNull, deepClone } = pm.ruleSets
const { and, eq, unionWith } = pm.commands
const R = require('ramda')

// Compose a new rule
const unionHostsByIp = {
  when: eq('node.name', 'hosts')
  then: unionWith(R.eqBy(R.prop('ip')))
}

// Compile the rules
const merge = pm.compile({ rules: [ unionHostsByIp, ignoreNull, deepClone ] })

// Define the documents
const a = {
  poll: {
    delay: null,
    frequency: '5s',
  },
  hosts: [
    { ip: '192.168.1.100', port: 80 },
    { ip: '192.168.1.200', port: 80 }
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

// Merge the documents
const result = merge(a, b)
```
#### Result:
```
{
  poll: {
    frequency: '5s',
  },
  hosts: [
    { ip: '192.168.1.100', port: 80 },
    { ip: '192.168.1.101', port: 8080 },
    { ip: '192.168.1.200', port: 80 }
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
const merge = pm.compile({
  api: {
    synchronous: false,
    direction: 'right-to-left',
    varardic: false
  },
  rules: [ ... ]
})

merge([d, c, b, a], (err, result) => {
  // profit
})
```
The merge function can be promisified if you prefer.

### Rules
power-merge operates on an array of rules. A rule is comprised of zero or one `when` conditions and exactly one `then` condition.

```js
const { eq, clone } = pm.commands
const rules = [
  {
    when: eq('a.value', undefined),
    then: clone('b.value')
  },
  {
    then: clone('a.value')
  }
]
```
The `when` conditions are tested in order until one passes, after which the associated `then` condition is invoked. The result of the `then` condition will normally be the merge result, but could be the `pm.noop` token to instruct the merge function to skip over the current node instead of merging it.

To support re-use you can also provide nested arrays of rules which power-merge will automatically flatten, e.g.

```js
const baseRules = [ rule1, rule2, rule3 ]
const customRules = [ rule4, rule5 ]
const rules = [ customRules, baseRules ]
```

### RuleSets
power-merge ships with the following preconfigured rulesets

#### alwaysIgnore
Will always pass, and do nothing. Useful to place at the end of your rules array if you don't like the default behaviour of throwing an error when no rules pass.
```js
const { alwaysIgnore } = pm.ruleSets
const rules = [ customRules, alwaysIgnore ]
```

#### deepClone
Uses a combination of [recurseKeys](#recurseKeys), [iterate](#iterate) and [clone](clone#) commands to recursively clone two documents own properties.
```js
const { deepClone } = pm.ruleSets
const rules = [ customRules, deepClone ]
```

#### errorOnCircularReference
Does what it says on the tin
```js
const { errorOnCircularReference } = pm.ruleSets
const rules = [ customRules, errorOnCircularReference, deepClone ]
```

#### errorOnNoMatchingRules
Also does what it says on the tin. This rule is automatically added to the end of every ruleset. If you want different behaviour finish your ruleset with something like [alwaysIgnore](#alwaysIgnore)

### Facts
Facts is a document are passed to each `when` and `then` condition. The facts are...

```js
{
  a: {
    value: '30s',
    type: 'String',
    circular: false
  },
  b: {
    value: '1m',
    type: 'String',
    circular: false
  },
  node: {
    depth: 3,
    name: 'delay',
    path: 'poll.delay'
  }
}
```
`when` conditions are used to check the facts. If they return true, the `then` condition will be executed. `then` conditions typically reference, clone or descend into the fact's `a.value` and/or `b.value`, but could also be written to perform operations upon any of the facts.

### Context
The context contains information about the current merge. It records the depth, current node name and path. It also contains a reference to the merge function that is used to recursively descend into objects or iterate over arrays. Unless you're writing your own commands, you won't need to know about the context.

### Commands
Commands are the functions which operate on [facts](#facts). You specify them in the `when` and `then` conditions. e.g.

```js
const { eq, clone } = pm.commands
const rules = [
  {
    when: eq('a.value', 'foo'),
    then: clone('a.value')
  }
]
```
references two commands, `eq` and `clone`. The `eq` command takes two parameters, `path` and `value`. It uses the `path` to extract data from the [facts](#facts) and compares it to the `value`, returning true if they are equal, and false otherwise.

The `clone` takes one parameter, `path`. It clones the data located at the specified `path` and returns it to the merge operation. Several commands are included with power-merge. It is also easy to write your own [custom commands](#custom-commands).

#### always
Always execute the `then` command.
```js
const { always, clone } = pm.commands
const rules = [
  {
    when: always(),
    then: clone('a.value')
  }
]
```
Since `when` will default to `always`, you can achieve the same result by omitting the `when` clause altogether.

#### and
Boolean AND multiple commands. e.g.
```js
const { and, eq, clone } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'String'),
      eq('b.type', 'String')
    ]),
    then: clone('a.value')
  }
]
```

#### clone
Clones the value specified by the [path](#paths) parameter using [Ramda's clone](http://ramdajs.com/docs/#clone) function.
```js
const { clone } = pm.commands
const rules = [
  {
    then: clone('a.value')
  }
]
```

#### compose
Composes a chain of commands so the output from one will be passed to the next. This is useful post processing tasks such as sorting arrays, e.g.
```js
const { and, eq, compose, union, invoke } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Array'),
      eq('b.type', 'Array')
    ]),
    then: compose([
      union(),
      invoke(R.sort((a, b) => a.localeCompare(b.ip)))
    ])
  }
]
```

#### debug
Useful for debuging output to the consule while developing your merge rules, however use with care since this command will also cause the current node to be omitted from the merged document. The first parameter is a [hogan.js](https://www.npmjs.org/package/hogan.js) template, the second (optional) parameter is a logger in case you want to direct output somewhere other than the console.

```js
const { debug } = pm.commands
const rules = [
  {
    then: debug('A: {{value.a}}, B: {{value.b}}')
  }
]
```

#### eq
Compares the value located at the given [path](#paths) with the second parameter, returning true if they are equal and false otherwise
```js
const { eq, clone } = pm.commands
const rules = [
  {
    when: eq('a.type', 'Number'),
    then: clone('a.value')
  }
]
```

#### error
Throws an error constructed from the given [hogan.js](https://www.npmjs.org/package/hogan.js) template
```js
const { error } = pm.commands
const rules = [
  {
    then: error('Boom! A: {{value.a}}, B: {{value.b}}')
  }
]
```

#### gt
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is greater and false otherwise
```js
const { gt, clone } = pm.commands
const rules = [
  {
    when: gt('a.value', 10),
    then: clone('a.value')
  }
]
```

#### gte
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is greater or equal and false otherwise
```js
const { gte, clone } = pm.commands
const rules = [
  {
    when: gte('a.value', 10),
    then: clone('a.value')
  }
]
```

#### ignore
Ignores a part of the document, e.g.
```js
const { eq, ignore } = pm.commands
const rules = [
  {
    when: eq('a.value', 'do-not-want'),
    then: ignore()
  }
]
```

#### invoke (inline)
Invokes an inline function.
```js
const { invoke } = pm.commands
const rules = [
  {
    when: invoke(facts => facts.value.a === 'yes'),
    then: invoke(facts => true)
  }
]
```

#### invoke (named)
Invokes a named function.
```js
const { invoke } = pm.commands
const rules = [
  {
    when: invoke('isYes'),
    then: invoke('truism')
  }
]
pm.compile({ rules }, {
  isYes: facts => facts.value.a === 'yes'
  truism: facts => true
})
```

#### iterate
Iterates over two arrays, merging each item. If the arrays are different lengths, overflowing items will be merged against undefined.
```js
const { and, eq, iterate } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Array'),
      eq('b.type', 'Array')
    ]),
    then: iterate()
  }
]
```

#### lt
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is less and false otherwise
```js
const { lt, clone } = pm.commands
const rules = [
  {
    when: lt('a.value', 10),
    then: clone('a.value')
  }
]
```

#### lte
Compares the value located at the given [path](#paths) with the second parameter, returning true if it is less or equal and false otherwise
```js
const { lte, clone } = pm.commands
const rules = [
  {
    when: lte('a.value', 10),
    then: clone('a.value')
  }
]
```

#### matches
Tests the value located at the given [path](#paths) against a regex.
```js
const { matches, clone } = pm.commands
const rules = [
  {
    when: matches('a.value', /foo/i),
    then: clone('a.value')
  }
]
```

#### ne
Compares the value located at the given [path](#paths) with the second parameter, returning false if they are equal and true otherwise
```js
const { ne } = pm.commands
const rules = [
  {
    when: ne('a.type', 'Number'),
    then: clone('a.value')
  }
]
```

#### never
Never execute the `then` command.
```js
const { never, clone } = pm.commands
const rules = [
  {
    when: never(),
    then: clone('a.value')
  }
]
```
Only useful for tests or to temporarily disable a rule.

#### or
Boolean OR multiple commands. e.g.
```js
const { or, eq, clone } = pm.commands
const rules = [
  {
    when: or([
      eq('a.type', 'String'),
      eq('a.type', 'Number')
    ]),
    then: clone('a.value')
  }
]
```

#### recurseKeys
Recursively merge union of `Object.keys('a')` and `Object.keys('b')`, i.e. all enumerable own properties. Only sensible when both 'a' and 'b' are objects (use the [iterate](#iterate) command to recurively merge two arrays).
```js
const { and, eq, recurseKeys } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Object'),
      eq('b.type', 'Object')
    ]),
    then: recurseKeys()
  }
]
```

#### recurseKeysIn
Recursively merge union of `R.keysIn('a')` and `R.keysIn('b')`, i.e. all enumerable own and inherited properties. Only sensible when both 'a' and 'b' are objects (use the [iterate](#iterate) command to recurively merge two arrays).
```js
const { and, eq, recurseKeysIn } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Object'),
      eq('b.type', 'Object')
    ]),
    then: recurseKeysIn()
  }
]
```

#### reference
References the value specified by the [path](#paths) parameter.
```js
const { reference } = pm.commands
const rules = [
  {
    then: reference('a.value')
  }
]
```

#### union
Union the "a" and "b" values using [Ramda's union](http://ramdajs.com/docs/#lensPath) function (which also dedupes). Only sensible when both "a" and "b" are arrays.
```js
const { and, eq, union } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Array'),
      eq('b.type', 'Array')
    ]),
    then: union()
  }
]
```

#### unionWith
Union the "a" and "b" values using [Ramda's unionWith](http://ramdajs.com/docs/#lensPath) function (which dedupes based on the result of the given function). Only sensible when both "a" and "b" are arrays.
```js
const { and, eq, unionWith } = pm.commands
const rules = [
  {
    when: and([
      eq('a.type', 'Array'),
      eq('b.type', 'Array')
    ]),
    then: unionWith(function(v) {
      return v.id
    })
  }
]
```

### Custom Commands
power-merge commands are easy to write, once you understand that they must be expressed as 3 levels of nested functions.

```js
module.exports = function one(param1, param2) {
  return function two(context) {
    return function three(facts) {
      return result // or pm.noop
    }
  }
}
```

1. The outer function takes the command's configuration parameters
1. The middle function takes the [context](#context)
1. The inner function takes the [facts](#facts), e.g.

```js
const debug = require('debug')('power-merge:commands:highlight')

module.exports = function __highlight(str) {

  return function _highlight(context) {

    return function highlight(facts) {

      debug('path: %o, facts: %o', path, facts)
      const result = str + view(facts) + str

      debug('return: %o', result)
      return result
    }
  }
})
```
Commands that should cause an attribute to be ignored, rather than merged should return the special `pm.noop` token. i.e.

```js
const debug = require('debug')('power-merge:commands:log')
const noop = require('pm').noop

module.exports = function __log(text) {

  return function _log(context) {

    return function log(facts) {
      debug('path: %o, facts: %o', path, facts)
      console.log(text)
      return noop
    }
  }
})
```

### Paths
Several of the bundled commands take a `path` parameter to locate a value within the [facts](#facts). In the readme and examples this is always expressed as a dotpath, e.g. `a.value`, however under the hood this is converted to an array ['a', 'value'], which is passed to [Ramda's lensPath](http://ramdajs.com/docs/#lensPath) function. If you can't use dots in your path for any reason, you can pass in an array, e.g.
```js
const { eq, ignore } = pm.commands
const rules = [
  {
    when: eq(['a', 'value'], 'nothing to see here'),
    then: ignore()
  }
]
```

### Circular References
If you use the [clone](#clone) command circular references will be handled automatically. Clone uses [Ramda's clone](http://ramdajs.com/docs/#clone) function under the hood, which makes a copy of the original item, but uses references to the copy if they are encountered in a circular context. If you prefer some other action, then you can explicitly handle circular references as with any other [fact](#facts).

### Debugging
power-merge uses [debug](https://www.npmjs.org/package/debug). You can enable as follows...
```
DEBUG='power-merge:*' node your-application.js
```
