var assert = require('chai').assert
var odata = require('../../lib/commands/odata')
var Context = require('../../lib/Context')

describe('odata command', function() {

    var context = new Context()

    it('should test facts with odata query', function() {
        var cmd = odata('a/value eq 1')(context)
        assert.equal(cmd({ a: { value: 1 } }), true)
        assert.equal(cmd({ a: { value: 2 } }), false)
    })

    it('should throw error on invalid queries', function() {
        assert.throws(function() {
            odata('invalid(a/value)')(context)
        }, /Unexpected character/)
    })

})
