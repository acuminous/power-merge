const eq = require('../commands/eq');
const ignore = require('../commands/ignore');

module.exports = [
  // Ignore null 'a' values
  {
    when: eq('a.value', null),
    then: ignore()
  }
];
