var assert = require('chai').assert
var union = require('../../lib/commands/union')

describe('union command', function() {

    it('should combine two arrays ignoring duplicates', function() {
        var cmd = union()
        var facts = {
            a: { value: [1, 2, 3, 4, 5, 6, 7] },
            b: { value: [4, 5, 6, 7, 8, 9, 10] }
        }

        var result = cmd(facts)
        assert.equal(result.length, 10)
        for (var i = 0; i < result.length; i++) {
            assert.equal(result[i], i+1)
        }
    })
})
