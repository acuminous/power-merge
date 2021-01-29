const assert = require('assert');
const reference = require('../../lib/commands/reference');
const Context = require('../../lib/Context');

describe('reference command', () => {

  const context = new Context();

  it('should reference "a" using an array path', () => {
    const cmd = reference(['a', 'value'])(context);
    const facts = {
      a: { value: { foo: 1 } },
      b: { value: { foo: 2 } }
    };

    const result = cmd(facts);
    assert.strictEqual(result.foo, facts.a.value.foo);
    assert.ok(result === facts.a.value);
  });

  it('should reference "b" using a string path', () => {
    const cmd = reference('b.value')(context);
    const facts = {
      a: { value: { foo: 1 } },
      b: { value: { foo: 2 } }
    };

    const result = cmd(facts);
    assert.strictEqual(result.foo, facts.b.value.foo);
    assert.ok(result === facts.b.value);
  });
});
