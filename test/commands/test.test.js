var assert = require('chai').assert
var test = require('../../lib/commands/test')
var R = require('ramda')

describe.only('test command', function() {

    it('should test inline functions', function() {
        var cmd = test(R.T, {}, {})
        assert.equal(cmd(), true)
    })

    it('should test named functions', function() {
        var cmd = test('T', {}, { T: R.T })
        assert.equal(cmd(), true)
    })

    it('should error on missing named functions', function() {
        var cmd = test('T', {}, { })
        assert.throws(function() {
            cmd()
        }, /No such command: T/)
    })

    it('should error on non functions', function() {
        var cmd = test('T', {}, { T: true })
        assert.throws(function() {
            cmd()
        }, /T is not a function/)
    })

    it('should convert truthy to true', function() {
        var cmd = test(R.always(1), {}, {})
        assert.equal(cmd(), true)
    })

    it('should convert falsey to false', function() {
        var cmd = test(R.always(0), {}, {})
        assert.equal(cmd(), false)
    })

})
