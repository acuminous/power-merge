var assert = require('chai').assert
var or = require('../../lib/commands/or')
var R = require('ramda')

describe('or command', function() {

    it('should return the result of all commands', function() {
        var cmd = or([
            R.pathEq(['a', 'value'], 2),
            R.pathEq(['b', 'value'], 1)
        ])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return the result of no commands', function() {
        var cmd = or([])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should short circuit when a command return true', function() {
        var cmd = or([
            R.pathEq(['a', 'value'], 1),
            function() {
                throw new Error('Did not short circuit')
            }
        ])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
