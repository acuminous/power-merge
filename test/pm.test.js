var assert = require('chai').assert
var R = require('ramda')
var pm = require('..')
var cmds = pm.commands
var format = require('util').format
var path = require('path')
var examples = require('require-all')({ filter: /(.*)\.js$/, dirname: path.join(__dirname, 'examples') })

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
          then: cmds.invoke(function mdl(facts) {
            return R.mergeDeepLeft(facts.a.value, facts.b.value)
          })
        }
      ]

      testFn(step, function(test, done) {
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
        when: cmds.never(),
        then: cmds.invoke(function() {
          throw new Error('Should have been ignored')
        })
      }, {
        when: cmds.always(),
        then: cmds.ignore()
      }])
      merge(1, 2)
    })

    it('should invoke rules that pass the when condition', function() {
      var merge = compile([{
        when: cmds.always(),
        then: cmds.invoke(sum)
      }])
      assert.equal(merge(1, 2), 3)
    })

    it('should invoke rules without a when condition', function() {
      var merge = compile([{
        then: cmds.invoke(sum)
      }])
      assert.equal(merge(1, 2), 3)
    })

    it('should provide when condition the value facts', function() {
      var merge = compile([{
        when: cmds.invoke(function(facts) {
          assert.equal(facts.a.value, 1)
          assert.equal(facts.b.value, 2)
          return true
        }),
        then: cmds.invoke(sum)
      }])
      assert.equal(merge(1, 2), 3)
    })

    it('should provide when condition the type facts', function() {
      var merge = compile([{
        when: cmds.invoke(function(facts) {
          assert.equal(facts.a.type, 'Number')
          assert.equal(facts.b.type, 'Number')
          return true
        }),
        then: cmds.invoke(sum)
      }])
      assert.equal(merge(1, 2), 3)
    })

    it('should provide when condition the node facts', function() {
      var merge = compile([
        {
          when: cmds.eq('node.name', 'b'),
          then: cmds.invoke(function(facts) {
            assert.equal(facts.node.name, 'b')
            assert.equal(facts.node.path, 'a.b')
            assert.equal(facts.node.depth, 2)
            return facts.a.value + facts.b.value
          })
        }, {
          then: cmds.recurseKeys()
        }
      ])
      var result = merge({ a: { b: 1 } }, { a: { b: 2 } })
      assert.equal(result.a.b, 3)
    })

    it('should short circuit after invoking a rule', function() {
      var merge = compile([
        {
          when: cmds.always(),
          then: cmds.invoke(sum)
        },
        {
          when: cmds.always(),
          then: cmds.invoke(function() {
            throw new Error('Should not have been invoked')
          })
        }
      ])
      assert.equal(merge(1, 2), 3)
    })

    it('should error if no rules pass', function() {
      var merge = compile([{
        when: cmds.never(),
        then: cmds.invoke(sum)
      }])
      assert.throws(function() {
        merge(1, 2)
      }, /No passing when condition/)
    })

    it('should error asynchronously if no rules pass', function(test, done) {
      var merge = pm.compile({
        api: { async: true },
        rules: [{
          when: cmds.never(),
          then: cmds.invoke(sum)
        }]
      })
      merge(1, 2, function(err, result) {
        assert.equal('No passing when condition for (1, 2)', err.message)
        done()
      })
    })

    it('should error asynchronously for thrown errors', function(test, done) {
      var merge = pm.compile({
        api: { async: true },
        rules: [{
          when: cmds.always(),
          then: cmds.error('Oh Noes!')
        }]
      })
      merge(1, 2, function(err, result) {
        assert.equal('Oh Noes!', err.message)
        done()
      })
    })
  })

  describe('Circular References', function() {

    var mergeTolerateCircular = pm.compile({ rules: [
      {
        when: cmds.and([
          cmds.eq('a.type', 'Object'),
          cmds.eq('b.type', 'Object')
        ]),
        then: cmds.recurseKeys()
      },
      {
        when: cmds.and([
          cmds.eq('a.type', 'Array'),
          cmds.eq('b.type', 'Array')
        ]),
        then: cmds.iterate()
      },
      {
        then: cmds.clone('a.value')
      }
    ]})

    var mergeErrorOnCircular = pm.compile({ rules: [
      {
        when: cmds.or([
          cmds.eq('a.circular', true),
          cmds.eq('b.circular', true)
        ]),
        then: cmds.error('Circular reference at {{node.path}}')
      },
      {
        when: cmds.or([
          cmds.eq('a.type', 'Object'),
          cmds.eq('b.type', 'Object')
        ]),
        then: cmds.recurseKeys()
      },
      {
        when: cmds.or([
          cmds.eq('a.type', 'Array'),
          cmds.eq('b.type', 'Array')
        ]),
        then: cmds.iterate()
      },
      {
        then: cmds.clone('a.value')
      }
    ]})

    it('should tolerate circular references in objects without special rules', function() {
      var a = {}
      var b = { x: 1 }
      a.x = a
      var result = mergeTolerateCircular(a, b)
      assert.equal(result.x, result.x.x)
    })

    it('should tolerate circular references in arrays without special rules', function() {
      var a = []
      var b = [1]
      a.push(a)
      var result = mergeTolerateCircular(a, b)
      assert.equal(result[0], result[0][0])
    })

    it('should report circular references in objects', function() {
      var a = {}
      var b = {}
      a.x = a
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at x/)
    })

    it('should report circular references in objects when b is undefined', function() {
      var a = {}
      var b
      a.x = a
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at x/)
    })

    it('should report circular references in objects when a is undefined', function() {
      var a
      var b = {}
      b.x = b
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at x/)
    })

    it('should report circular references in arrays', function() {
      var a = []
      var b = []
      a.push(a)
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at 0/)
    })

    it('should report circular references in arrays when b is undefined', function() {
      var a = []
      var b
      a.push(a)
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at 0/)
    })

    it('should report circular references in arrays when a is undefined', function() {
      var a
      var b = []
      b.push(b)
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at 0/)
    })

    it('should report circular references in array attributes of objects', function() {
      var a = { x: [] }
      var b = { x: [] }
      a.x.push(a)
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at x.0/)
    })

    it('should report circular references in object items in arrays', function() {
      var a = [{}]
      var b = [{}]
      a[0].x = a
      assert.throws(function() {
        mergeErrorOnCircular(a, b)
      }, /Circular reference at 0.x/)
    })

    it('should not report circular references in array siblings', function() {
      var sibling = { sibling: 1 }
      var a = { a: sibling, b: sibling, c: sibling }
      var b = { a: 1, b: 1, c: 2 }

      var result = mergeErrorOnCircular(a, b)
      assert.equal(result.a.sibling, 1)
      assert.equal(result.b.sibling, 1)
      assert.equal(result.c.sibling, 1)
    })

    it('should not report circular references in object siblings', function() {
      var sibling = { a: 1 }
      var a = [sibling, sibling, sibling]
      var b = [1, 2, 3]

      var result = mergeErrorOnCircular(a, b)
      assert.equal(result.length, 3)
      assert.equal(result[0].a, 1)
      assert.equal(result[1].a, 1)
      assert.equal(result[2].a, 1)
    })
  })

  describe('Examples', function() {

    Object.keys(examples).forEach(function(name) {
      it(name, function() {
        var example = examples[name]
        var merge = pm.compile(example.config)

        var result = merge(example.data)

        assert.deepEqual(result, example.result)
      }, { timeout: 0 })
    })

  })
})
