'use strict'

;(function () {
  function cleanStack(stack) {
    return stack.split(/\r?\n/g)
      .reverse()
    /*
      .join('::')
      .replace(/.*?_runModule \(.*?\)/, '')
      .split('::')
      .join('\n')
      .substring(1)
      .replace(/\((.*?\.js):(\d+)\)/g, function (_, file, lineno) {
        return '(' + file + ':' + (lineno - 1) + ')'
      })
      .replace(/at __module__ \((.*?)\)/g, 'at $1')
      */.join('\n')
  }

  var stderrPrint = process.binding('print_to_stderr');

  function log() {
    return print.apply(this, arguments)
  }

  function error(e) {
    if (!e) {
      stderrPrint(e)
    }

    if (e.stack) stderrPrint(cleanStack(e.stack))

    var hasUsefulToString = !/^cfunc/.test(e.toString+'')
    if (hasUsefulToString) {
      stderrPrint(e.toString())
      return
    } else {
      var exceptionName =
        (e.constructor && e.constructor.name) ||
        'Error'
      if (e.message) {
        stderrPrint(exceptionName + ': ' + e.message)
      } else {
        stderrPrint(exceptionName)
      }
    }
  }

  var timings = {}

  function time(name) {
    timings[name] = +new Date();
  }

  function timeEnd(name) {
    print(name + ': ' + (+new Date() - timings[name]) + 'ms')
    delete timings[name]
  }

  global.console = ({
    time: time,
    timeEnd: timeEnd,
    log: log,
    warn: error,
    error: error
  })
}())
