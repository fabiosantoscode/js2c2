'use strict'

(function () {
  var PREFIX = '(function (module, exports, require) {\n'
  var SUFFIX = '\n})'

  var coreModules = File.list('node/lib')
    .filter(function (file) {
      return file[0] !== '_' && /\.js$/.test(file)
    })
    .map(function (file) {
      return file.replace(/\.js$/, '')
    })

  function Module(filename, parent) {
    this._filename = filename
    this.exports = {}
    this.parent = parent || null
    this.require = mkRequire(this)
  }

  var requireCache = {}

  function mkRequire(module) {
    return function require(filename) {
      if (filename in requireCache) {
        return requireCache[filename]
      }

      if (coreModules.indexOf(filename) !== -1) {
        return require(
          'node/lib/' + filename + '.js'
        )
      }

      var requiredModule = new Module(filename, module)

      requiredModule._run()

      requireCache[filename] = requiredModule.exports

      return requiredModule.exports
    }
  }

  Module.prototype._run = function _runModule() {
    var moduleFn = PREFIX +
      File.read(this._filename) +
      SUFFIX

    _evalWithFilename(moduleFn, this._filename)(this, this.exports, this.require)
  }

  return Module
})()

