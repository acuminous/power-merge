var assert = require('chai').assert
var and = require('../../lib/commands/and')
var R = require('ramda')
var Context = require('../../lib/Context')

describe('and command', function() {

    var context = new Context()

    it('should return the result of all commands', function() {
        var cmd = and([
            R.pathEq(['a', 'value'], 1),
            R.pathEq(['b', 'value'], 2)
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
            R.pathEq(['a', 'value'], 2),
            function() {
                throw new Error('Did not short circuit')
            }
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })
})
