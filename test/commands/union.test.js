const assert = require('chai').assert;
const union = require('../../lib/commands/union');
const Context = require('../../lib/Context');

describe('union command', () => {

  const context = new Context();

  it('should combine two arrays ignoring duplicates', () => {
    const cmd = union()(context);
    const facts = {
      a: { value: [1, 2, 3, 4, 5, 6, 7] },
      b: { value: [4, 5, 6, 7, 8, 9, 10] }
    };

    const result = cmd(facts);
    assert.equal(result.length, 10);
    for (let i = 0; i < result.length; i++) {
      assert.equal(result[i], i+1);
    }
  });
});
