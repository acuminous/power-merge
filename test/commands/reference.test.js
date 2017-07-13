var assert = require('chai').assert
var reference = require('../../lib/commands/reference')

describe('reference command', function() {

    it('should reference "a"', function() {
        var cmd = reference()
        var a = { foo: 1 }
        var b = { foo: 2 }
        assert.ok(cmd(a, b) === a)
    })

    it('should reference "b" when inverted', function() {
        var cmd = reference({ invert: true })
        var a = { foo: 1 }
        var b = { foo: 2 }
        assert.ok(cmd(a, b) === b)
    })

    it('should reference "a" explicitly not inverted', function() {
        var cmd = reference({ invert: false })
        var a = { foo: 1 }
        var b = { foo: 2 }
        assert.ok(cmd(a, b) === a)
    })

})
