var assert = require('chai').assert
var odata = require('../../lib/commands/odata')

describe('odata command', function() {

    it('should test facts with odata query', function() {
        var cmd = odata('a/value eq 1')
        assert.equal(cmd({ a: { value: 1 } }), true)
        assert.equal(cmd({ a: { value: 2 } }), false)
    })

    it('should throw error on invalid queries', function() {
        assert.throws(function() {
            odata('invalid(a/value)')
        }, /Unexpected character/)
    })

})
