'use strict'

(function main() {
  function pathJoin(){
    var replace = new RegExp('/{1,}', 'g');
    return [].slice.call(arguments).join('/').replace(replace, '/')
  }

  var Module = File.eval('lib/module.js')

  function reverseStack(stack) {
    return stack.split(/\r?\n/g).reverse().join('\n')
  }

  function printStackAndDie(e) {
    if (!e) {
      e = {}
    }
    var exceptionName =
      (e.constructor && e.constructor.name) ||
      'Error'
    print(exceptionName)
    if (e.stack) print(reverseStack(e.stack))
    if (e.message) print(e.message)
  }

  function run(module) {
    try {
      module._run()
    } catch(e) {
      printStackAndDie(e)
    }
  }

  if (!global.process) {
    run(new Module('test/index.js', /*parent=*/null))
  } else if (process.argv.length >= 2) {
    // Run a file
    run(new Module(process.argv[1], /*parent=*/null))
  } else {
    // Give up for now
    print('usage: ' + process.argv[0] + ' FILE.js')
    exit(1)
  }

})();

