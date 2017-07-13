var odata = require('odata-v4-inmemory')
var buildQuery = require('odata-query')
var assert = require('chai').assert
var R = require('ramda')
var pm = require('..')
var format = require('util').format

describe('Power Merge', function() {

    describe('API', function() {

        var permutations = [
            { async: false, variadic: true, direction: 'left' },
            { async: false, variadic: true, direction: 'right' },
            { async: false, variadic: false, direction: 'left' },
            { async: false, variadic: false, direction: 'right' },
            { async: true, variadic: true, direction: 'left' },
            { async: true, variadic: true, direction: 'right' },
            { async: true, variadic: false, direction: 'left' },
            { async: true, variadic: false, direction: 'right' }
        ]

        var data = [
            { a: '1.1', b: { a: '1.2.1' } },
            { a: '2.1', b: { a: '2.2.1', b: '2.2.2' }, c: '2.3' },
            { a: '3.1', b: { a: '3.2.1', b: '3.2.2', c: '3.2.3' }, c: '3.3', d: '3.4' }
        ]

        function assertMergeResult(original, copy, merged) {
            assert.equal(JSON.stringify(original), JSON.stringify(copy), 'Data was mutated by merge')

            assert.equal(merged.a, '1.1')
            assert.equal(merged.b.a, '1.2.1')
            assert.equal(merged.b.b, '2.2.2')
            assert.equal(merged.b.c, '3.2.3')
            assert.equal(merged.c, '2.3')
            assert.equal(merged.d, '3.4')
        }

        permutations.forEach(function(config) {

            var step = format('should support %s %s merges %s',
                config.async ? 'asynchronous' : 'synchronous',
                config.variadic ? 'variadic' : 'array',
                config.direction == 'left' ? 'from left to right' : 'from right to left'
            )

            testFn = it
            if (config.only) testFn = it.only
            if (config.skip) testFn = it.skip

            config.rules = [
                {
                    then: pm.invoke(function mdl(facts) {
                        return R.mergeDeepLeft(facts.a.value, facts.b.value)
                    })
                }
            ]

            testFn(step, function(done) {
                var merge = pm.compile({ config: config })
                var original = R.clone(data)

                if (config.direction == 'right') original.reverse()
                var copy = R.clone(original)

                var cb = function(err, result) {
                    assert.ifError(err)
                    assertMergeResult(original, copy, result)
                    done()
                }

                var args = config.variadic ? original : [original]
                if (config.async) {
                    merge.apply(null, args.concat(cb))
                } else {
                    var result = merge.apply(null, args)
                    cb(null, result)
                }
            })
        })
    })

    describe('Rules', function() {

        function compile(rules) {
            return pm.compile({
                config: {
                    rules: rules
                }
            })
        }

        function sum(facts) {
            return facts.a.value + facts.b.value
        }

        it('should ignore rules that fail the when condition', function() {
            var merge = compile([{
                when: pm.test(R.F),
                then: pm.invoke(function() {
                    throw new Error('Should have been ignored')
                })
            }])
            merge(1, 2)
        })

        it('should invoke rules that pass the when condition', function() {
            var merge = compile([{
                when: pm.test(R.T),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should supply when condition with value facts', function() {
            var merge = compile([{
                when: pm.test(function(facts) {
                    assert.equal(facts.a.value, 1)
                    assert.equal(facts.b.value, 2)
                    return true
                }),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should supply when condition with type facts', function() {
            var merge = compile([{
                when: pm.test(function(facts) {
                    assert.equal(facts.a.type, 'Number')
                    assert.equal(facts.b.type, 'Number')
                    return true
                }),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should short circuit after invoking a rule', function() {
            var merge = compile([{
                when: pm.test(R.T),
                then: pm.invoke(sum)
            },
            {
                when: pm.test(R.T),
                then: pm.invoke(function() {
                    throw new Error('Should not have been invoked')
                })
            }])
            assert.equal(merge(1, 2), 3)
        })
    })
})
