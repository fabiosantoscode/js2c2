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

  function dirname(filename) {
    return filename.split('/').slice(0, -1).join('/')
  }

  function basename(filename) {
    return filename.split('/').pop()
  }

  function Module(filename, parent) {
    requireCache[filename] = this
    this._filename = filename
    this._dirname = dirname(filename)
    this.exports = {}
    this.parent = parent || null
    this.require = mkRequire((0,this))
    this._run()
  }

  var requireCache = {}

  var realpath = process.binding('realpath')
  function mkRequire(module, moduleDirName) {
    var isRootRequire = false
    if (!moduleDirName && module) {
      isRootRequire = true
      moduleDirName = module._dirname
    }
    var extensions = ['.js', '.json']
    function finaliseResolve(filename) {
      var ret = realpath(filename)
      if (File.read(ret) == null) {
        var error = new Error('Cannot find module \'' + originalResolveFilename)
        error.code = 'MODULE_NOT_FOUND'
        throw error
      }
      return ret
    }
    var originalResolveFilename
    var resolveIsRecursive = {}
    function resolve(filename, isRecursive) {
      if (isRecursive !== resolveIsRecursive) {
        originalResolveFilename = filename
      }
      if (coreModules.indexOf(filename) !== -1) {
        return 'node/lib/' + filename + '.js'
      }

      var extension = undefined
      for (var i = 0; i < extensions.length; i++) {
        var ext = extensions[i]
        if (File.read(filename + ext)) {
          return finaliseResolve(filename + ext)
        }
      }

      if (/^\.\//.test(filename) && !/^\.\/\.\//.test(filename)) {
        if (!/\.js/.test(filename)) {  // TODO completely wrong
          filename += '.js'
        }
        return finaliseResolve(moduleDirName + '/' + filename)
      } else if (!/^\.\//.test(filename) && !/^node\//.test(filename)) {
        var nodeModuleName = filename // TODO support eg react/lib/index
        var moduleName = filename.split('/').shift()
        for (
          var currentDir = moduleDirName;
          currentDir && currentDir !== '/';
          currentDir = dirname(currentDir)
        ) {
          var foundNodeModule = File.list(currentDir + '/node_modules/' + moduleName)
          if (foundNodeModule && foundNodeModule.indexOf('package.json') >= 0) {
            if (moduleName !== filename) {
              // require('moduleName/foo/bar')
              return resolve(currentDir + '/node_modules/' + filename, resolveIsRecursive)
            }
            var packageJson = JSON.parse(File.read(currentDir + '/node_modules/' + moduleName + '/package.json') || 'null')
            if (packageJson && packageJson.main) {
              return finaliseResolve(currentDir + '/node_modules/' + moduleName + '/' + packageJson.main)
            } else {
              return finaliseResolve(currentDir + '/node_modules/' + moduleName + '/index.js')
            }
          }
        }
      }

      return finaliseResolve(filename)
    }
    function require(filename) {
      var oldFilename = filename
      filename = resolve(filename)

      if (filename in requireCache) {
        return requireCache[filename].exports
      }

      var requiredModule = new Module(filename.replace(/^\.\/\.\//, './'), module)

      return requiredModule._run()
    }
    require.resolve = resolve
    return require
  }

  Module.prototype._run = function _runModule() {
    if (this._exported) {
      return this.exports
    }

    var code = File.read(this._filename)

    if (code == null) {
      throw new Error('coult not read file to run: ' + this._filename)
    }

    var massagedCode = global._hacks.massageRegex(PREFIX + code + SUFFIX, this._filename)

    var moduleFn = _evalWithFilename(massagedCode, this._filename)
    if (typeof moduleFn !== 'function') {
      print("fn", moduleFn)
    }
    moduleFn(this, this.exports, this.require)

    this._exported = true

    return this.exports
  }

  Module.createRootRequire = function (rootFileName) {
    Module.rootRequire = mkRequire(null, dirname(rootFileName))
  }

  return Module
})()

