const assert = require('chai').assert;
const unionWith = require('../../lib/commands/unionWith');
const Context = require('../../lib/Context');

describe('unionWith command', () => {

  const context = new Context();

  it('should combine two arrays ignoring duplicates', () => {
    function abs(a, b) {
      return Math.abs(a) === Math.abs(b);
    }

    const cmd = unionWith(abs)(context);
    const facts = {
      a: { value: [1, 2, 3, 4, 5] },
      b: { value: [-1, -2, -3, -4, -5] }
    };

    const result = cmd(facts);
    assert.equal(result.length, 5);
    for (let i = 0; i < result.length; i++) {
      assert.equal(result[i], i+1);
    }
  });
});
