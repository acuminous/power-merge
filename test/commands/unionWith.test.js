var assert = require('chai').assert
var unionWith = require('../../lib/commands/unionWith')
var Context = require('../../lib/Context')

describe('unionWith command', function() {

    var context = new Context()

    it('should combine two arrays ignoring duplicates', function() {
        function abs(a, b) {
            return Math.abs(a) === Math.abs(b)
        }

        var cmd = unionWith(abs)
        var facts = {
            a: { value: [1, 2, 3, 4, 5] },
            b: { value: [-1, -2, -3, -4, -5] }
        }

        var result = cmd(context, facts)
        assert.equal(result.length, 5)
        for (var i = 0; i < result.length; i++) {
            assert.equal(result[i], i+1)
        }
    })
})
