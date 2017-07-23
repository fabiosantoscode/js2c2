global._hacks = global._hacks || {}

global._hacks.reactMassageShortcut = function (filename) {
  return /node_modules\/(react|prop-types|create-react-class|react-dom|fbjs)/.test(filename) &&
    !/ReactComponentTreeHook.js$/.test(filename) &&
    !/ReactDOMComponentTree.js$/.test(filename)
}

global._hacks.reactMassageLine = function (s, filename) {
  if (!/node_modules\/react-dom/.test(filename)) {
    return
  }
  if (/ReactDOMComponentTree.js$/.test(filename) && /outer: for /.test(s)) {
    var ret = s.replace('outer:', '') + 'var _brk = false'
    console.log('ret', ret)
    return ret
  }
  if (/ReactDOMComponentTree.js$/.test(filename) && /continue outer;/.test(s)) {
    var ret = '_brk=true; break'
    console.log('ret', ret)
    return ret
  }
  if (/ReactDOMComponentTree.js$/.test(filename) && /We reached the end of the DOM children without finding an ID match./.test(s)) {
    return 'if (_brk) { continue }'
  }
}
