'use strict'

(function main() {
  function pathJoin(){
    var replace = new RegExp('/{1,}', 'g');
    return [].slice.call(arguments).join('/').replace(replace, '/')
  }

  File.eval('lib/console.js')
  File.eval('lib/module.js')

  global.Buffer = Module.rootRequire('node/lib/buffer.js', /*parent=*/null).Buffer

  if (!global.process || process.argv.length >= 2) {
    var filename = process.argv[1]
    Module.rootRequire(filename)
  } else {
    // Give up for now
    print('usage: ' + process.argv[0] + ' FILE.js')
    exit(1)
  }

})();

