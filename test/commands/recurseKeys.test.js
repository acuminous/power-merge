var assert = require('chai').assert
var recurseKeys = require('../../lib/commands/recurseKeys')
var Context = require('../../lib/Context')

describe('recurseKeys command', function() {

    function concat(args) {
        return args[0] + '-' + args[1]
    }

    it('should recuse objects when both keys are present', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-2.1')
    })

    it('should recurse objects when key exists in a but not in b', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: {} },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-undefined')
    })

    it('should recurse objects when key exists in b but not in a', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: {} },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, 'undefined-2.1')
    })

    it('should recuse objects a is undefined', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: undefined },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, 'undefined-2.1')
    })

    it('should recuse objects a is null', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: undefined },
            b: { value: { x: '2.1' } },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, 'undefined-2.1')
    })

    it('should recuse objects when b is undefined', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: undefined },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-undefined')
    })

    it('should recuse objects when b is null', function() {
        var context = new Context({ merge: concat })

        var cmd = recurseKeys()(context)
        var facts = {
            a: { value: { x: '1.1' } },
            b: { value: undefined },
            node: { depth: 1 }
        }

        var result = cmd(facts)
        assert.equal(result.x, '1.1-undefined')
    })
})
