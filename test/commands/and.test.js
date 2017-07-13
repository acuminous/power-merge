var assert = require('chai').assert
var and = require('../../lib/commands/and')
var R = require('ramda')

describe('and command', function() {

    it('should return the result of all commands', function() {
        var cmd = and([
            R.pathEq(['a', 'value'], 1),
            R.pathEq(['b', 'value'], 2)
        ])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return the result of no commands', function() {
        var cmd = and([])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should short circuit when a command return false', function() {
        var cmd = and([
            R.pathEq(['a', 'value'], 2),
            function() {
                throw new Error('Did not short circuit')
            }
        ])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })
})
