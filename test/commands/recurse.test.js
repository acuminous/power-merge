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

    it('should recurse using context when key exists in a but not in b', function() {
        var context = new Context()
        var cmd = recurse({}, {}, context)
        context.set(concat)

        var result = cmd({ a: '1.1' }, {})
        assert.equal(result.a, '1.1-undefined')
    })

    it('should clone b when not in a', function() {
        var context = new Context()
        var cmd = recurse({}, {}, context)
        context.set(concat)

        var result = cmd({}, { a: '2.1' })
        assert.equal(result.a, 'undefined-2.1')
    })
})
