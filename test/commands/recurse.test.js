var assert = require('chai').assert
var recurse = require('../../lib/commands/recurse')
var Context = require('../../lib/Context')

describe('recurse command', function() {

    function concat(args) {
        return args[0] + '-' + args[1]
    }

    it('should recuse using context when both keys are present', function() {
        var context = new Context({ merge: concat })

        var cmd = recurse(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-2.1')
    })

    it('should recurse using context when key exists in a but not in b', function() {
        var context = new Context({ merge: concat })

        var cmd = recurse(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: {} },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-undefined')
    })

    it('should clone b when not in a', function() {
        var context = new Context({ merge: concat })

        var cmd = recurse(context)
        var facts = {
            a: { value: {} },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, 'undefined-2.1')
    })
})
