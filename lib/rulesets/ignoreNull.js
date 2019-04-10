var eq = require('../commands/eq')
var ignore = require('../commands/ignore')

module.exports = [
  // Ignore null 'a' values
  {
    when: eq('a.value', null),
    then: ignore()
  }
]


