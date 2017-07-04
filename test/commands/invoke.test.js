var assert = require('chai').assert
var invoke = require('../../lib/commands/invoke')

describe('invoke command', function() {

    function sum(a, b) {
        return a + b
    }

    it('should invoke inline functions', function() {
        var cmd = invoke(sum, {}, {})
        assert.equal(cmd(1, 2), 3)
    })

    it('should invoke named functions', function() {
        var cmd = invoke('sum', {}, { sum: sum })
        assert.equal(cmd(1, 2), 3)
    })

    it('should error on missing named functions', function() {
        var cmd = invoke('sum', {}, {})
        assert.throws(function() {
            cmd(1, 2)
        }, /No such command: sum/)
    })

    it('should error on non functions', function() {
        var cmd = invoke('sum', {}, { sum: true })
        assert.throws(function() {
            cmd(1, 2)
        }, /sum is not a function/)
    })
})
