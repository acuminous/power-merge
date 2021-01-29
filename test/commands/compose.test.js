const assert = require('chai').assert;
const union = require('../../lib/commands/union');
const invoke = require('../../lib/commands/invoke');
const compose = require('../../lib/commands/compose');
const R = require('ramda');
const Context = require('../../lib/Context');

describe('compose command', () => {

  const context = new Context();

  it('should return the result of all functions', () => {

    const cmd = compose([
      union(),
      invoke(R.reverse)
    ])(context);

    const facts = {
      a: { value: [1, 2, 3, 4, 5, 6, 7] },
      b: { value: [4, 5, 6, 7, 8, 9, 10] }
    };

    const result = cmd(facts).reverse();
    assert.equal(result.length, 10);
    for (let i = 0; i < result.length; i++) {
      assert.equal(result[i], i+1);
    }
  });

  it('should return the result of no commands', () => {
    const cmd = compose([])(context);
    const facts = { a: { value : 1 }, b: { value: 2 } };

    assert.equal(cmd(facts), undefined);
  });
});
