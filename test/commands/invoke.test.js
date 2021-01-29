const assert = require('chai').assert;
const invoke = require('../../lib/commands/invoke');
const Context = require('../../lib/Context');

describe('invoke command', () => {

  function sum(facts) {
    return facts.a.value + facts.b.value;
  }

  it('should invoke inline functions', () => {
    const context = new Context();
    const cmd = invoke(sum)(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), 3);
  });

  it('should invoke named functions', () => {
    const context = new Context({ namedCommands: { sum } });
    const cmd = invoke('sum')(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), 3);
  });

  it('should error on missing named functions', () => {
    const context = new Context();
    const cmd = invoke('sum')(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.throws(() => {
      cmd(facts);
    }, /No such command: sum/);
  });

  it('should error on non functions', () => {
    const context = new Context({ namedCommands: { sum: true } });
    const cmd = invoke('sum')(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.throws(() => {
      cmd(facts);
    }, /sum is not a function/);
  });
});
