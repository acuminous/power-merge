const assert = require('assert');
const R = require('ramda');
const pm = require('..');
const cmds = pm.commands;
const format = require('util').format;
const path = require('path');
const examples = require('require-all')({ filter: /(.*)\.js$/, dirname: path.join(__dirname, 'examples') });

describe('Power Merge', () => {

  describe('API', () => {

    const permutations = [
      { async: false, variadic: true, direction: 'left-to-right' },
      { async: false, variadic: true, direction: 'right-to-left' },
      { async: false, variadic: false, direction: 'left-to-right' },
      { async: false, variadic: false, direction: 'right-to-left' },
      { async: true, variadic: true, direction: 'left-to-right' },
      { async: true, variadic: true, direction: 'right-to-left' },
      { async: true, variadic: false, direction: 'left-to-right' },
      { async: true, variadic: false, direction: 'right-to-left' }
    ];

    const data = [
      { a: '1.1', b: { a: '1.2.1' } },
      { a: '2.1', b: { a: '2.2.1', b: '2.2.2' }, c: '2.3' },
      { a: '3.1', b: { a: '3.2.1', b: '3.2.2', c: '3.2.3' }, c: '3.3', d: '3.4' }
    ];

    function assertMergeResult(original, copy, merged) {
      assert.strictEqual(JSON.stringify(original), JSON.stringify(copy), 'Data was mutated by merge');

      assert.strictEqual(merged.a, '1.1');
      assert.strictEqual(merged.b.a, '1.2.1');
      assert.strictEqual(merged.b.b, '2.2.2');
      assert.strictEqual(merged.b.c, '3.2.3');
      assert.strictEqual(merged.c, '2.3');
      assert.strictEqual(merged.d, '3.4');
    }

    permutations.forEach((options) => {

      const step = format('should support %s %s merges %s',
        options.async ? 'asynchronous' : 'synchronous',
        options.variadic ? 'variadic' : 'array',
        options.direction === 'left-to-right' ? 'from left to right' : 'from right to left'
      );

      let testFn = it;
      if (options.only) testFn = it.only;
      if (options.skip) testFn = it.skip;

      const rules = [
        {
          then: cmds.invoke((facts) => R.mergeDeepLeft(facts.a.value, facts.b.value))
        }
      ];

      testFn(step, (test, done) => {
        const merge = pm.compile({ api: options, rules });
        const original = R.clone(data);

        if (options.direction === 'right-to-left') original.reverse();
        const copy = R.clone(original);

        const cb = function(err, result) {
          assert.ifError(err);
          assertMergeResult(original, copy, result);
          done();
        };

        const args = options.variadic ? original : [original];
        if (options.async) {
          merge(...args, cb);
        } else {
          const result = merge(...args);
          cb(null, result);
        }
      });
    });
  });

  describe('Rules', () => {

    function compile(rules) {
      return pm.compile({ rules });
    }

    function sum(facts) {
      return facts.a.value + facts.b.value;
    }

    it('should ignore rules that fail the when condition', () => {
      const merge = compile([{
        when: cmds.never(),
        then: cmds.invoke(() => {
          throw new Error('Should have been ignored');
        })
      }, {
        when: cmds.always(),
        then: cmds.ignore()
      }]);
      merge(1, 2);
    });

    it('should invoke rules that pass the when condition', () => {
      const merge = compile([{
        when: cmds.always(),
        then: cmds.invoke(sum)
      }]);
      assert.strictEqual(merge(1, 2), 3);
    });

    it('should invoke rules without a when condition', () => {
      const merge = compile([{
        then: cmds.invoke(sum)
      }]);
      assert.strictEqual(merge(1, 2), 3);
    });

    it('should provide when condition the value facts', () => {
      const merge = compile([{
        when: cmds.invoke((facts) => {
          assert.strictEqual(facts.a.value, 1);
          assert.strictEqual(facts.b.value, 2);
          return true;
        }),
        then: cmds.invoke(sum)
      }]);
      assert.strictEqual(merge(1, 2), 3);
    });

    it('should provide when condition the type facts', () => {
      const merge = compile([{
        when: cmds.invoke((facts) => {
          assert.strictEqual(facts.a.type, 'Number');
          assert.strictEqual(facts.b.type, 'Number');
          return true;
        }),
        then: cmds.invoke(sum)
      }]);
      assert.strictEqual(merge(1, 2), 3);
    });

    it('should provide when condition the node facts', () => {
      const merge = compile([
        {
          when: cmds.eq('node.name', 'b'),
          then: cmds.invoke((facts) => {
            assert.strictEqual(facts.node.name, 'b');
            assert.strictEqual(facts.node.path, 'a.b');
            assert.strictEqual(facts.node.depth, 2);
            return facts.a.value + facts.b.value;
          })
        }, {
          then: cmds.recurseKeys()
        }
      ]);
      const result = merge({ a: { b: 1 } }, { a: { b: 2 } });
      assert.strictEqual(result.a.b, 3);
    });

    it('should short circuit after invoking a rule', () => {
      const merge = compile([
        {
          when: cmds.always(),
          then: cmds.invoke(sum)
        },
        {
          when: cmds.always(),
          then: cmds.invoke(() => {
            throw new Error('Should not have been invoked');
          })
        }
      ]);
      assert.strictEqual(merge(1, 2), 3);
    });

    it('should error if no rules pass', () => {
      const merge = compile([{
        when: cmds.never(),
        then: cmds.invoke(sum)
      }]);
      assert.throws(() => {
        merge(1, 2);
      }, /No passing when condition/);
    });

    it('should error asynchronously if no rules pass', (test, done) => {
      const merge = pm.compile({
        api: { async: true },
        rules: [{
          when: cmds.never(),
          then: cmds.invoke(sum)
        }]
      });
      merge(1, 2, (err) => {
        assert.strictEqual('No passing when condition for (1, 2)', err.message);
        done();
      });
    });

    it('should error asynchronously for thrown errors', (test, done) => {
      const merge = pm.compile({
        api: { async: true },
        rules: [{
          when: cmds.always(),
          then: cmds.error('Oh Noes!')
        }]
      });
      merge(1, 2, (err) => {
        assert.strictEqual('Oh Noes!', err.message);
        done();
      });
    });
  });

  describe('Circular References', () => {

    const mergeTolerateCircular = pm.compile({ rules: [
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
    ]});

    const mergeErrorOnCircular = pm.compile({ rules: [
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
    ]});

    it('should tolerate circular references in objects without special rules (a)', () => {
      const a = {};
      const b = { x: 1 };
      a.x = a;
      const result = mergeTolerateCircular(a, b);
      assert.strictEqual(result.x, result.x.x);
    });

    it('should tolerate circular references in objects without special rules (b)', () => {
      const a = { x: 1 };
      const b = {};
      b.y = b;
      const result = mergeTolerateCircular(a, b);
      assert.strictEqual(result.x, 1);
      assert.strictEqual(result.x.y, undefined);
    });

    it('should tolerate circular references in objects without special rules (a & b)', () => {
      const a = {};
      const b = {};
      a.x = a;
      b.x = b;
      const result = mergeTolerateCircular(a, b);
      assert.strictEqual(result.x, undefined);
    });

    it('should tolerate circular references in arrays without special rules', () => {
      const a = [];
      const b = [1];
      a.push(a);
      const result = mergeTolerateCircular(a, b);
      assert.strictEqual(result[0], result[0][0]);
    });

    it('should report circular references in objects (a)', () => {
      const a = {};
      const b = {};
      a.x = a;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x/);
    });

    it('should report circular references in objects (b)', () => {
      const a = {};
      const b = {};
      b.x = b;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x/);
    });

    it('should report circular references in objects (a & b)', () => {
      const a = {};
      const b = {};
      a.x = a;
      b.x = b;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x/);
    });

    it('should report circular references in objects when a is undefined', () => {
      let a;
      const b = {};
      b.x = b;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x/);
    });

    it('should report circular references in objects when b is undefined', () => {
      const a = {};
      a.x = a;
      let b;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x/);
    });

    it('should report circular references in arrays', () => {
      const a = [];
      const b = [];
      a.push(a);
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at 0/);
    });

    it('should report circular references in arrays when b is undefined', () => {
      const a = [];
      let b;
      a.push(a);
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at 0/);
    });

    it('should report circular references in arrays when a is undefined', () => {
      let a;
      const b = [];
      b.push(b);
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at 0/);
    });

    it('should report circular references in array attributes of objects', () => {
      const a = { x: [] };
      const b = { x: [] };
      a.x.push(a);
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at x.0/);
    });

    it('should report circular references in object items in arrays', () => {
      const a = [{}];
      const b = [{}];
      a[0].x = a;
      assert.throws(() => {
        mergeErrorOnCircular(a, b);
      }, /Circular reference at 0.x/);
    });

    it('should not report circular references in array siblings', () => {
      const sibling = { sibling: 1 };
      const a = { a: sibling, b: sibling, c: sibling };
      const b = { a: 1, b: 1, c: 2 };

      const result = mergeErrorOnCircular(a, b);
      assert.strictEqual(result.a.sibling, 1);
      assert.strictEqual(result.b.sibling, 1);
      assert.strictEqual(result.c.sibling, 1);
    });

    it('should not report circular references in object siblings', () => {
      const sibling = { a: 1 };
      const a = [sibling, sibling, sibling];
      const b = [1, 2, 3];

      const result = mergeErrorOnCircular(a, b);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[0].a, 1);
      assert.strictEqual(result[1].a, 1);
      assert.strictEqual(result[2].a, 1);
    });
  });

  describe('Examples', () => {

    Object.keys(examples).forEach((name) => {
      it(name, () => {
        const example = examples[name];
        const merge = pm.compile(example.config);

        const result = merge(example.data);

        assert.deepStrictEqual(result, example.result);
      }, { timeout: 0 });
    });

  });
});
