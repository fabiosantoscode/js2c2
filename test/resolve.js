// NO_MASSAGE_REGEX

var assert = require('assert')

assert.equal(require.resolve('assert'), 'node/lib/assert.js')
assert.equal(
  require.resolve('./required-file'),
  process.argv[1].replace(/resolve.js/, 'required-file.js')
)
assert.equal(
  require.resolve('react'),
  process.argv[1].replace(/\/test\/resolve.js/, '/node_modules/react/react.js')
)
assert.throws(function() {
  require.resolve('non-existing-node_module')
})
assert.throws(function() {
  require.resolve('./non-existing-node_module')
})
assert.throws(function() {
  require.resolve('node/lib/404.js')
})
