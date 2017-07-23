'use strict'

(function main() {
  function pathJoin(){
    var replace = new RegExp('/{1,}', 'g');
    return [].slice.call(arguments).join('/').replace(replace, '/')
  }

  File.eval('lib/console.js')
  File.eval('lib/module.js')
  File.eval('lib/hacks.js')
  File.eval('lib/react-hacks.js')

  var filename = process.argv[1]
  Module.createRootRequire(filename)

  global.Buffer = Module.rootRequire('node/lib/buffer.js').Buffer

  if (!global.process || process.argv.length >= 2) {
    Module.rootRequire(filename)
  } else {
    // Give up for now
    print('usage: ' + process.argv[0] + ' FILE.js')
    exit(1)
  }

})();

