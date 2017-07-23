// NO_MASSAGE_REGEX

var assert = require('assert')

// join() function polyfill
var tooBigToSplitJoin =
  'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx'
assert.equal(tooBigToSplitJoin.split('\n').join('\n'), tooBigToSplitJoin)
var reactCode =
  "('You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.');\n"

// Date.valueOf fix
var date = new Date()
assert.equal(+date, Math.floor(+date))
var dateNow = Date.now()
assert.equal(dateNow, Math.floor(dateNow))

assert.equal(_hacks.massageRegex('var foo = 3'), 'var foo = 3')
assert.equal(_hacks.massageRegex('x = 1 // foo / bar'), 'x = 1 // foo / bar')
assert.equal(_hacks.massageRegex('x = /easy-regex/g'), 'x = /easy-regex/g')
assert.equal(
  _hacks.massageRegex('x = /(hard-)\\\\regex/'),
  'x = new RegExp("(hard-)\\\\\\\\regex", "")'
)

var comment =
  '// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or'
assert.equal(_hacks.massageRegex(comment), comment)

var url = '//  https://example.com'
assert.equal(_hacks.massageRegex(url), url)

var division = 'return x / 2 / 4'
assert.equal(_hacks.massageRegex(division), division)

assert.equal(_hacks.massageRegex(reactCode), reactCode)

var reactCode2 =
  "lowPriorityWarning(warnedForSpread, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.');"

assert.equal(reactCode2.split('\n').join('\n'), reactCode2)
assert.equal(_hacks.massageRegex(reactCode2), reactCode2)
