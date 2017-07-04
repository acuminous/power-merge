const odata = require('odata-v4-inmemory')
const buildQuery = require('odata-query')
const assert = require('chai').assert

describe.skip('Some Queries', () => {

    it('Check depth', () => {
        const filter = odata.createFilter('depth gt 10')
        assert.ok(!filter({ depth: 10 }))
        assert.ok(filter({ depth: 11 }))
    })

    it('Check circular', () => {
        const filter = odata.createFilter('circular eq true')
        assert.ok(!filter({ circular: false }))
        assert.ok(filter({ circular: true }))
    })

    it('Check value is null', () => {
        const filter = odata.createFilter('a/value eq null')
        assert.ok(!filter({ a: { value: 'not null' } }))
        assert.ok(filter({ a: { value: null } }))
    })

    it('Check type is function', () => {
        const filter = odata.createFilter('a/type eq \'function\'')
        assert.ok(!filter({ a: { type: 'array' } }))
        assert.ok(filter({ a: { type: 'function' } }))
    })

    it('Check both arrays', () => {
        const filter = odata.createFilter('a/type eq \'array\' and b/type eq \'array\'')
        assert.ok(!filter({ a: { type: 'array' }, b: { type: 'string' } }))
        assert.ok(filter({ a: { type: 'array' }, b: { type: 'array' } }))
    })

    it('Check custom function', () => {
        const filter = odata.createFilter('matches(a/value, \'foo\') eq true')
        assert.ok(filter({ a: { value: 'foo' } }))
        assert.ok(!filter({ a: { value: 'bar' } }))
    })

    it('odata query', () => {
        const query = buildQuery.default({ filter: { 'a/value': 'foo' } }).slice('?$filter='.length)
        const expression = odata.compileExpression(query)
        assert.ok(!expression({ a: { value: 'bar'} }))
        assert.ok(expression({ a: { value: 'foo'} }))
    })

})
