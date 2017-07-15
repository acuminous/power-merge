var assert = require('chai').assert
var and = require('../../lib/commands/and')
var eq = require('../../lib/commands/eq')
var Context = require('../../lib/Context')

describe('and command', function() {

    var context = new Context()

    it('should return the result of all commands', function() {
        var cmd = and([
            eq(1, ['a', 'value']),
            eq(2, ['b', 'value'])
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return the result of no commands', function() {
        var cmd = and([])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should short circuit when a command return false', function() {
        var cmd = and([
            eq(2, ['a', 'value']),
            function() {
                throw new Error('Did not short circuit')
            }
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })
})