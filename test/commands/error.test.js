var assert = require('chai').assert
var error = require('../../lib/commands/error')

describe('error command', function() {

    it('should throw an error', function() {
        var cmd = error('Oh Noes!')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(facts)
        }, /Oh Noes!/)
    })

    it('should use template', function() {
        var cmd = error('Oh Noes! {{a.value}} {{b.value}}')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(facts)
        }, /Oh Noes! 1 2/)
    })

})
