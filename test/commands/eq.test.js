var assert = require('chai').assert
var eq = require('../../lib/commands/eq')

describe('eq command', function() {

    it('should return true when "a" equals the given value by default', function() {
        var cmd = eq(1)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return false when "a" does not equal the given value by default', function() {
        var cmd = eq(2)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return true when "b" equals the given value when specified', function() {
        var cmd = eq(2, ['b', 'value'])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
