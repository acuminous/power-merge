var assert = require('chai').assert
var recurse = require('../../lib/commands/recurse')
var Context = require('../../lib/Context')

describe('recurse command', function() {

    function concat(a, b) {
        return a + '-' + b
    }

    it('should recuse using context when both keys are present', function() {
        var context = new Context()
        var cmd = recurse({}, {}, context)
        context.set(concat)
        var result = cmd({ a: '1.1' }, { a: '2.1' })
        assert.equal(result.a, '1.1-2.1')
    })

    it('should clone a when not in b', function() {
        var context = new Context()
        var cmd = recurse({}, {}, context)
        context.set(concat)

        var a = { x: { y: 1 } }
        var b = {}
        var result = cmd(a, b)

        a.x.y = 2
        assert.equal(result.x.y, 1)
    })

    it('should clone b when not in a', function() {
        var context = new Context()
        var cmd = recurse({}, {}, context)
        context.set(concat)

        var a = {}
        var b = { x: { y: 1 } }
        var result = cmd(a, b)

        b.x.y = 2
        assert.equal(result.x.y, 1)
    })
})
