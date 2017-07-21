var always = require('../commands/always')
var error = require('../commands/error')

module.exports = [
    {
        when: always(),
        then: error('No passing when condition for ({{a.value}}, {{b.value}})')
    }
]