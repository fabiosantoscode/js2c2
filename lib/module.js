'use strict'

global.Module = (function () {
  // start function and declare module-locals
  var PREFIX = '(function __module__(module, exports, require) {\n'
  // end function and add an empty comment to allow people to end scripts with /*
  var SUFFIX = '\n/**/})'

  var coreModules = File.list('node/lib')
    .map(function (file) {
      if (/\.js$/.test(file))
        return file.replace(/\.js$/, '')
    })
    .filter(Boolean)

  function Module(filename, parent) {
    requireCache[filename] = this
    this._filename = filename
    this._dirname = filename.split('/').slice(0, -1).join('/')
    this.exports = {}
    this.parent = parent || null
    this.require = mkRequire((0,this))
    this._run()
  }

  var requireCache = {}

  function mkRequire(module) {
    return function require(filename, moduleDirName) {
      if (moduleDirName && module) {
        // only accept custom moduleDirName argument if it's the root require
        moduleDirName = undefined
      }

      if (coreModules.indexOf(filename) !== -1) {
        return require('node/lib/' + filename + '.js')
      }

      if (/^\.\//.test(filename) && !/^\.\/\.\//.test(filename)) {
        if (!/\.js/.test(filename)) {  // TODO completely wrong
          filename += '.js'
        }
        return require(module._dirname + '/' + filename)
      }

      if (filename in requireCache) {
        return requireCache[filename].exports
      }

      var requiredModule = new Module(filename.replace(/^\.\/\.\//, './'), module)

      return requiredModule._run()
    }
  }

  Module.prototype._run = function _runModule() {
    if (this._exported) {
      return this.exports
    }

    var code = File.read(this._filename)

    if (code == null) {
      var err = new Error('Cannot find module ' + "'" + this._filename + "'")
      err.code = 'MODULE_NOT_FOUND'
      throw err;
    }

    var moduleFn = _evalWithFilename(PREFIX + code + SUFFIX, this._filename)
    if (typeof moduleFn !== 'function') {
      print("fn", moduleFn)
    }
    moduleFn(this, this.exports, this.require)

    this._exported = true

    return this.exports
  }

  Module.rootRequire = mkRequire(null)

  return Module
})()

