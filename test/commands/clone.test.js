var assert = require('chai').assert
var clone = require('../../lib/commands/clone')
var R = require('ramda')
var Context = require('../../lib/Context')

describe('clone command', function() {

    var context = new Context()

    it('should clone "a" by default', function() {
        var cmd = clone()(context)
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.a.value.foo)
        assert.ok(result !== facts.a.value)
    })

    it('should clone "b" when specified', function() {
        var cmd = clone(['b', 'value'])(context)
        var facts = {
            a: { value: { foo: 1 } },
            b: { value: { foo: 2 } }
        }

        var result = cmd(facts)
        assert.equal(result.foo, facts.b.value.foo)
        assert.ok(result !== facts.b.value)
    })
})
