var assert = require('chai').assert
var recurse = require('../../lib/commands/recurse')
var Context = require('../../lib/Context')

describe('recurse command', function() {

    function merge(a, b) {
        return a + '-' + b
    }

    it('should descend into objects', function() {
        var context = new Context()
        context.set(merge)
        var cmd = recurse({}, {}, context)
        var result = cmd({ a: '1.1', b: '1.2' }, { a: '2.1', c: '2.2' })
        assert.equal(result.a, '1.1-2.1')
        assert.equal(result.b, '1.2')
        assert.equal(result.c, '2.2')
    })
})
