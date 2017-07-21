var assert = require('chai').assert
var ne = require('../../lib/commands/ne')
var Context = require('../../lib/Context')

describe('ne command', function() {

    var context = new Context()

    it('should return true when "a" equals the value specified using an array path', function() {
        var cmd = ne(['a', 'value'], 2)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return false when "a" does not equal the value specified using an array path', function() {
        var cmd = ne(['a', 'value'], 1)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return true when "b" equals the the value specified using a string path', function() {
        var cmd = ne('b.value', 1)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
