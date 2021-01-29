const assert = require('chai').assert;
const clone = require('../../lib/commands/clone');
const Context = require('../../lib/Context');

describe('clone command', () => {

  const context = new Context();

  it('should clone "a" using array path', () => {
    const cmd = clone(['a', 'value'])(context);
    const facts = {
      a: { value: { foo: 1 } },
      b: { value: { foo: 2 } }
    };

    const result = cmd(facts);
    assert.equal(result.foo, facts.a.value.foo);
    assert.ok(result !== facts.a.value);
  });

  it('should clone "a" using string path', () => {
    const cmd = clone('a.value')(context);
    const facts = {
      a: { value: { foo: 1 } },
      b: { value: { foo: 2 } }
    };

    const result = cmd(facts);
    assert.equal(result.foo, facts.a.value.foo);
    assert.ok(result !== facts.a.value);
  });
});
