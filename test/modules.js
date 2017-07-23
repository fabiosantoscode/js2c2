
var assert = require('assert')

var undef = require('undefined/undefined')
var once = require('once')
var leftPad = require('left-pad')


assert.strictEqual(undef, undefined)


var callCount = 0
var func = once(function () {
  callCount++
  assert.equal(callCount, 1)
  return 25
})


assert.equal(func(), 25)
assert.equal(func(), 25)


assert.equal(leftPad('foo', 2), 'foo')
assert.equal(leftPad('foo', 4), ' foo')
assert.equal(leftPad('foo', 4, '_'), '_foo')


