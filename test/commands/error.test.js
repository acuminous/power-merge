var assert = require('chai').assert
var error = require('../../lib/commands/error')
var Context = require('../../lib/Context')

describe('error command', function() {

    var context = new Context()

    it('should throw an error', function() {
        var cmd = error('Oh Noes!')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(context, facts)
        }, /Oh Noes!/)
    })

    it('should use template', function() {
        var cmd = error('Oh Noes! {{a.value}} {{b.value}}')
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.throws(function() {
            cmd(context, facts)
        }, /Oh Noes! 1 2/)
    })

})
