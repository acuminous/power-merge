var assert = require('chai').assert
var clone = require('../../lib/commands/clone')
var Context = require('../../lib/Context')

describe('clone command', function() {

    var context = new Context()

    it('should clone "a" using array path', function() {
        var cmd = clone(['a', 'value'])(context)
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.a.value.foo)
        assert.ok(result !== facts.a.value)
    })

    it('should clone "a" using string path', function() {
        var cmd = clone('a.value')(context)
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.a.value.foo)
        assert.ok(result !== facts.a.value)
    })
})
