var assert = require('chai').assert
var ne = require('../../lib/commands/ne')

describe('ne command', function() {

    it('should return true when "a" equals the given value by default', function() {
        var cmd = ne(2)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return false when "a" does not equal the given value by default', function() {
        var cmd = ne(1)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return true when "b" equals the given value when specified', function() {
        var cmd = ne(1, ['b', 'value'])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
