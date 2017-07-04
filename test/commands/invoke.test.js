var assert = require('chai').assert
var invoke = require('../../lib/commands/invoke')

describe('invoke command', function() {

    it('should invoke inline functions', function() {
        var cmd = invoke(function sum(a, b) {
            return a + b
        })
        assert.equal(cmd(1, 2), 3)
    })

})
