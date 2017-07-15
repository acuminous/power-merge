var assert = require('chai').assert
var or = require('../../lib/commands/or')
var eq = require('../../lib/commands/eq')
var Context = require('../../lib/Context')

describe('or command', function() {

    var context = new Context()

    it('should return the result of all commands', function() {
        var cmd = or([
            eq(2, ['a', 'value']),
            eq(1, ['b', 'value'])
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return the result of no commands', function() {
        var cmd = or([])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should short circuit when a command return true', function() {
        var cmd = or([
            eq(1, ['a', 'value']),
            function() {
                throw new Error('Did not short circuit')
            }
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
