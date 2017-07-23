var assert = require('assert')

console.time('require react')
var React = require('react')
console.timeEnd('require react')

console.time('require react-dom/server')
var reactDOMServer = require('react-dom/server')
console.timeEnd('require react-dom/server')

var elem = React.createElement('div', {
  className: 'foo',
  style: { color: 'red' },
})

var result =
  '<div class="foo" style="color:red;" data-reactroot="" data-reactid="1" data-react-checksum="223484406"></div>'

assert.equal(reactDOMServer.renderToString(elem), result)
