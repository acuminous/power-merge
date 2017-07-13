var assert = require('chai').assert
var clone = require('../../lib/commands/clone')

describe('clone command', function() {

    it('should clone "a" by default', function() {
        var cmd = clone()
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.a.value.foo)
        assert.ok(result !== facts.a.value)
    })

    it('should clone "b" when specified', function() {
        var cmd = clone(['b', 'value'])
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.b.value.foo)
        assert.ok(result !== facts.b.value)
    })
})
