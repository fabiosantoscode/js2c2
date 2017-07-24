'use strict'

var assert = require('assert')
var events = require('events')
var stream = require('stream')
var path = require('path')

assert(process.argv instanceof Array)

assert.equal(module.parent, null)
assert.deepEqual(module.exports, {})
assert.equal(module.require, require)

var ee = new events.EventEmitter()

ee.on('event', function(a, b) {
  assert.deepEqual(a, { fake: 'a' })
  assert.deepEqual(b, { fake: 'b' })
})

ee.emit('event', { fake: 'a' }, { fake: 'b' })

assert.throws(function() {
  require('./non-existing-file')
})
assert.deepEqual(require('./required-file'), { required: 'thing' })

var date = new Date()
assert.equal(+date, Math.floor(+date))

assert.equal(path.join('/tmp', 'lol'), '/tmp/lol')
