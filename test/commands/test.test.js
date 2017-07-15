var assert = require('chai').assert
var test = require('../../lib/commands/test')
var R = require('ramda')
var Context = require('../../lib/Context')

describe('test command', function() {

    it('should test inline functions', function() {
        var context = new Context()
        var cmd = test(R.T)(context)
        assert.equal(cmd(), true)
    })

    it('should test named functions', function() {
        var context = new Context({ namedCommands: { T: R.T } })
        var cmd = test('T')(context)
        assert.equal(cmd(), true)
    })

    it('should error on missing named functions', function() {
        var context = new Context()
        var cmd = test('T')(context)
        assert.throws(function() {
            cmd()
        }, /No such command: T/)
    })

    it('should error on non functions', function() {
        var context = new Context({ namedCommands: { T: true } })
        var cmd = test('T')(context)
        assert.throws(function() {
            cmd()
        }, /T is not a function/)
    })

    it('should convert truthy to true', function() {
        var context = new Context()
        var cmd = test(R.always(1))(context)
        assert.equal(cmd(), true)
    })

    it('should convert falsey to false', function() {
        var context = new Context()
        var cmd = test(R.always(0))(context)
        assert.equal(cmd(), false)
    })

})
