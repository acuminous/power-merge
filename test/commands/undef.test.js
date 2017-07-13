var assert = require('chai').assert
var undef = require('../../lib/commands/undef')

describe('undef command', function() {

    it('should test if "a" is undefined by default', function() {
        var cmd = undef()
        assert.equal(cmd({ a: { value: undefined } }), true)
        assert.equal(cmd({ a: {} }), true)
        assert.equal(cmd({ a: { value: 1 } }), false)
    })

    it('should test if "b" is undefined when specified', function() {
        var cmd = undef(['b', 'value'])
        assert.equal(cmd({ b: { value: undefined } }), true)
        assert.equal(cmd({ b: {} }), true)
        assert.equal(cmd({ b: { value: 1 } }), false)
    })
})
