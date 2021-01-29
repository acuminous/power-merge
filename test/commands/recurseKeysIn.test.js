const assert = require('assert');
const recurseKeysIn = require('../../lib/commands/recurseKeysIn');
const Context = require('../../lib/Context');

describe('recurseKeysIn command', () => {

  function concat(args) {
    return args[0] + '-' + args[1];
  }

  it('should recuse objects when both keys are present', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: { x: '1.1' } },
      b: { value: { x: '2.1' } },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, '1.1-2.1');
  });

  it('should recurse objects when key exists in a but not in b', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: { x: '1.1' } },
      b: { value: {} },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, '1.1-undefined');
  });

  it('should recurse objects when key exists in b but not in a', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: {} },
      b: { value: { x: '2.1' } },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, 'undefined-2.1');
  });

  it('should recuse objects a is undefined', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: undefined },
      b: { value: { x: '2.1' } },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, 'undefined-2.1');
  });

  it('should recuse objects a is null', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: undefined },
      b: { value: { x: '2.1' } },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, 'undefined-2.1');
  });

  it('should recuse objects when b is undefined', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: { x: '1.1' } },
      b: { value: undefined },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, '1.1-undefined');
  });

  it('should recuse objects when b is null', () => {
    const context = new Context({ merge: concat });

    const cmd = recurseKeysIn()(context);
    const facts = {
      a: { value: { x: '1.1' } },
      b: { value: undefined },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.x, '1.1-undefined');
  });
});
