var assert = require('chai').assert
var error = require('../../lib/commands/error')

describe('error command', function() {

    it('should throw an error', function() {
        var cmd = error('Oh Noes!')
        assert.throws(function() {
            cmd(1, 2)
        }, /Oh Noes!/)
    })

    it('should use template', function() {
        var cmd = error('Oh Noes! {{a}} {{b}}')
        assert.throws(function() {
            cmd(1, 2)
        }, /Oh Noes! 1 2/)
    })

})
