var assert = require('chai').assert
var R = require('ramda')
var pm = require('..')
var format = require('util').format
var path = require('path')
var examples = require('require-all')({ dirname: path.join(__dirname, 'examples') })

describe('Power Merge', function() {

    describe('API', function() {

        var permutations = [
            { async: false, variadic: true, direction: 'left-to-right' },
            { async: false, variadic: true, direction: 'right-to-left' },
            { async: false, variadic: false, direction: 'left-to-right' },
            { async: false, variadic: false, direction: 'right-to-left' },
            { async: true, variadic: true, direction: 'left-to-right' },
            { async: true, variadic: true, direction: 'right-to-left' },
            { async: true, variadic: false, direction: 'left-to-right' },
            { async: true, variadic: false, direction: 'right-to-left' }
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

        permutations.forEach(function(options) {

            var step = format('should support %s %s merges %s',
                options.async ? 'asynchronous' : 'synchronous',
                options.variadic ? 'variadic' : 'array',
                options.direction === 'left-to-right' ? 'from left to right' : 'from right to left'
            )

            var testFn = it
            if (options.only) testFn = it.only
            if (options.skip) testFn = it.skip

            var rules = [
                {
                    then: pm.invoke(function mdl(facts) {
                        return R.mergeDeepLeft(facts.a.value, facts.b.value)
                    })
                }
            ]

            testFn(step, function(done) {
                var merge = pm.compile({ api: options, rules: rules })
                var original = R.clone(data)

                if (options.direction === 'right-to-left') original.reverse()
                var copy = R.clone(original)

                var cb = function(err, result) {
                    assert.ifError(err)
                    assertMergeResult(original, copy, result)
                    done()
                }

                var args = options.variadic ? original : [original]
                if (options.async) {
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
            return pm.compile({ rules: rules })
        }

        function sum(facts) {
            return facts.a.value + facts.b.value
        }

        it('should ignore rules that fail the when condition', function() {
            var merge = compile([{
                when: pm.invoke(R.F),
                then: pm.invoke(function() {
                    throw new Error('Should have been ignored')
                })
            }])
            merge(1, 2)
        })

        it('should invoke rules that pass the when condition', function() {
            var merge = compile([{
                when: pm.invoke(R.T),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should invoke rules without a when condition', function() {
            var merge = compile([{
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should provide when condition the value facts', function() {
            var merge = compile([{
                when: pm.invoke(function(facts) {
                    assert.equal(facts.a.value, 1)
                    assert.equal(facts.b.value, 2)
                    return true
                }),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should provide when condition the type facts', function() {
            var merge = compile([{
                when: pm.invoke(function(facts) {
                    assert.equal(facts.a.type, 'Number')
                    assert.equal(facts.b.type, 'Number')
                    return true
                }),
                then: pm.invoke(sum)
            }])
            assert.equal(merge(1, 2), 3)
        })

        it('should provide when condition the node facts', function() {
            var merge = compile([{
                when: pm.eq('node.name', 'b'),
                then: pm.invoke(function(facts) {
                    assert.equal(facts.node.name, 'b')
                    assert.equal(facts.node.path, 'a.b')
                    assert.equal(facts.node.depth, 2)
                    return facts.a.value + facts.b.value
                })
            }, {
                then: pm.recurse()
            }])
            var result = merge({ a: { b: 1 } }, { a: { b: 2 } })
            assert.equal(result.a.b, 3)
        })

        it('should short circuit after invoking a rule', function() {
            var merge = compile([{
                when: pm.invoke(R.T),
                then: pm.invoke(sum)
            },
            {
                when: pm.invoke(R.T),
                then: pm.invoke(function() {
                    throw new Error('Should not have been invoked')
                })
            }])
            assert.equal(merge(1, 2), 3)
        })
    })

    describe('Examples', function() {

        Object.keys(examples).forEach(function(name) {
            it(name, function() {
                var example = examples[name]
                var merge = pm.compile(example.config)

                var result = merge(example.data)

                assert.deepEqual(result, example.result)
            })
        })

    })
})
