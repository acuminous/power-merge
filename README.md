# power-merge
There are scores of merge libraries for node.js, but they all have hidden assumptions and surprises waiting to catch you out. For example

1. Ramda merge unions arrays
    ```
    R.merge({ a: [1, 2, 3], b: [3, 4, 5] }) === [ 1, 2, 3, 4, 5 ]
    ```

1. Lodash merge mashes (for want of a better word) arrays
    ```
    _.merge({ a: [1, 2, 3], b: [3, 4, 5, 6] }) === [ 1, 2, 3, 6 ]
    ```

There are situations (e.g. when you want to union by) when the above behaviour wont do, e.g.

```
var hosts = merge(
   [ { ip: '192.168.1.100' }, { ip: '192.168.1.101' } ]
   [ { ip: '192.168.1.100' }, { ip: '192.168.1.200' } ]
)
assert.deepEqual(hosts, [
    { ip: '192.168.1.100' },
    { ip: '192.168.1.101' },
    { ip: '192.168.1.200' }
])
```
power-merge puts you in charge of your merge rules, and making it easy to specify custom merge behaviour for any property within your documents.

## tldr;
```js
const pm = require('power-merge')
const R = require('ramda')


const config = {
    rules: [
        {
            when: pm.and([
                pm.eq('Object', ['a', 'type']),
                pm.eq('Object', ['b', 'type']),
            ]),
            then: pm.recurse()
        },
        {
            when: pm.and([
                pm.eq('Array', ['a', 'type']),
                pm.eq('Array', ['b', 'type']),
            ]),
            then: pm.compose([
                pm.union(),
                pm.invoke(R.sort((a, b) => a.localeCompare(b))
            ])
        },
        {
            when: pm.eq(undefined),
            then: pm.clone(['b', 'value'])
        },
        {
            then: pm.clone()
        }
    ]
})

const merge = pm.compile({ config })
var result = merge(
    { name: 'John', qualifications: [ 'Computer Science', 'English' ] },
    { age: 27, qualifications: [ 'Computer Science', 'Maths' ] }
)
assert.equal(result.name, 'John')
assert.equal(result.age, 27)
assert.deepEqual(result.qualifications, [
    'Computer Science',
    'English',
    'Maths'
])
```
