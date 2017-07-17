var assert = require('chai').assert
var invoke = require('../../lib/commands/invoke')
var Context = require('../../lib/Context')

describe('invoke command', function() {

    function sum(facts) {
        return facts.a.value + facts.b.value
    }

    it('should invoke inline functions', function() {
        var context = new Context()
        var cmd = invoke(sum)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(context, facts), 3)
    })

    it('should invoke named functions', function() {
        var context = new Context({ namedCommands: { sum: sum } })
        var cmd = invoke('sum')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(context, facts), 3)
    })

    it('should error on missing named functions', function() {
        var context = new Context()
        var cmd = invoke('sum')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(context, facts)
        }, /No such command: sum/)
    })

    it('should error on non functions', function() {
        var context = new Context({ namedCommands: { sum: true } })
        var cmd = invoke('sum')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(context, facts)
        }, /sum is not a function/)
    })
})
