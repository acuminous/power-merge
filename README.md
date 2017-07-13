# power-merge
Merges multiple objects in a configurable way

## tldr;
```js
const pm = require('power-merge')


const config = {
    api: {
        sync: true,
        direction: 'left',
        variadic: true
    },
    rules: [
        {
            when: pm.odata("depth gt 10"),
            then: pm.error("Max depth exceeded at {{path}}")
        },
        {
            when: pm.odata("circular eq true"),
            then: pm.error("Circular reference at {{path}}")
        },
        {
            when: pm.odata("a/value eq null"),
            then: pm.debug("Skipping null a/value at {{path}}")
        },
        {
            when: pm.test(() => true)
            then: pm.invoke(() => { /* noop */ })
        },
        {
            when: pm.test('namedTestFn')
            then: pm.invoke('namedActionFn')
        },
        {
            when: pm.odata("path eq 'some.flattened.property.path'"),
            then: pm.shallowClone()
        },
        {
            when: pm.odata("path eq 'some.other.flattened.property.path'"),
            then: pm.merge({ config: require("./different-config" }))
        },
        {
            when: pm.odata("r/type eq 'accessor'")
            then: pm.access()
            onError: [
                {
                    when: pm.odata("contains(err/message, 'some special case'")),
                    then: pm.debug('Error calling accessor at {{path}}: {{err.message}}'),
                },
                {
                    then: pm.rethrow()
                }
            ]
        },
        {
            when: pm.and([
                pm.odata("a/type eq 'array'"),
                pm.odata("b/type eq 'array'")
            ]),
            then: pm.union({ key: "id" })
        },
        {
            when: pm.odata("r/type eq 'function'"),
            then: pm.reference()
        },
        {
            then: pm.recurse()
        }
    ]
})

const merge = pm.compile({ config })
merge(a, b, c, d)

```
