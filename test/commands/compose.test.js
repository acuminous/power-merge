var assert = require('chai').assert
var union = require('../../lib/commands/union')
var compose = require('../../lib/commands/compose')
var R = require('ramda')

describe('compose command', function() {

    it('should return the result of all functions', function() {

        function reverse(a, b) {
            return b - a
        }

        var cmd = compose([
            union(),
            R.sort(reverse)
        ])

        var facts = {
            a: { value: [1, 2, 3, 4, 5, 6, 7] },
            b: { value: [4, 5, 6, 7, 8, 9, 10] }
        }

        var result = cmd(facts).reverse()
        assert.equal(result.length, 10)
        for (var i = 0; i < result.length; i++) {
            assert.equal(result[i], i+1)
        }
    })

    it('should return the result of no commands', function() {
        var cmd = compose([])
        var facts = { a: { value : 1 }, b: { value: 2 } }

        assert.equal(cmd(facts), undefined)
    })
})
