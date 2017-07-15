var assert = require('chai').assert
var or = require('../../lib/commands/or')
var R = require('ramda')
var Context = require('../../lib/Context')

describe('or command', function() {

    var context = new Context()

    it('should return the result of all commands', function() {
        var cmd = or([
            R.pathEq(['a', 'value'], 2),
            R.pathEq(['b', 'value'], 1)
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
            R.pathEq(['a', 'value'], 1),
            function() {
                throw new Error('Did not short circuit')
            }
        ])(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
