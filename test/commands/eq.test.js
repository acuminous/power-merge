var assert = require('chai').assert
var eq = require('../../lib/commands/eq')
var Context = require('../../lib/Context')

describe('eq command', function() {

    var context = new Context()

    it('should return true when "a" equals value specified using an array path', function() {
        var cmd = eq(['a', 'value'], 1)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })

    it('should return false when "a" does not equal value specified using an array path', function() {
        var cmd = eq(['value', 'a'], 2)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), false)
    })

    it('should return true when "b" equals the given value when specified using a string path', function() {
        var cmd = eq('b.value', 2)(context)
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), true)
    })
})
