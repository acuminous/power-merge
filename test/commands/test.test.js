var assert = require('chai').assert
var test = require('../../lib/commands/test')

describe('test command', function() {

    it('should test inline functions', function() {
        var cmd = test(function() {
            return true
        })
        assert.equal(cmd(), true)
    })

    it('should convert truthy to true', function() {
        var cmd = test(function() {
            return 'ok'
        })
        assert.equal(cmd(), true)
    })


    it('should convert falsey to false', function() {
        var cmd = test(function() {
            return 0
        })
        assert.equal(cmd(), false)
    })

})
