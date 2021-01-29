const assert = require('assert');
const iterate = require('../../lib/commands/iterate');
const Context = require('../../lib/Context');

describe('iterate command', () => {

  function concat(args) {
    return args[0] + '-' + args[1];
  }

  it('should iterate over arrays when both items are present', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: [ '1.1', '1.2' ] },
      b: { value: [ '2.1', '2.2' ] },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.1-2.1');
    assert.strictEqual(result[1], '1.2-2.2');
  });

  it('should iterate over arrays when item exists in a but not in b', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: [ '1.1', '1.2' ] },
      b: { value: [ '2.1' ] },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.1-2.1');
    assert.strictEqual(result[1], '1.2-undefined');
  });

  it('should iterate over arrays when item exists in b but not in a', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: [ '1.1' ] },
      b: { value: [ '2.1', '2.2' ] },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.1-2.1');
    assert.strictEqual(result[1], 'undefined-2.2');
  });

  it('should iterate over arrays when a is undefined', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: undefined },
      b: { value: [ '2.1', '2.2' ] },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'undefined-2.1');
    assert.strictEqual(result[1], 'undefined-2.2');
  });

  it('should iterate over arrays when a is null', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: null },
      b: { value: [ '2.1', '2.2' ] },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], 'undefined-2.1');
    assert.strictEqual(result[1], 'undefined-2.2');
  });


  it('should iterate over arrays when b is undefined', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: [ '1.1', '1.2' ] },
      b: { value: undefined },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.1-undefined');
    assert.strictEqual(result[1], '1.2-undefined');
  });

  it('should iterate over arrays when b is null', () => {
    const context = new Context({ merge: concat });

    const cmd = iterate()(context);
    const facts = {
      a: { value: [ '1.1', '1.2' ] },
      b: { value: null },
      node: { depth: 1 }
    };

    const result = cmd(facts);
    assert.strictEqual(result.length, 2);
    assert.strictEqual(result[0], '1.1-undefined');
    assert.strictEqual(result[1], '1.2-undefined');
  });
});
