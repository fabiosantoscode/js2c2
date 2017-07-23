(function () {
  global._hacks = global._hacks || {}
  // +new Date in v7 returns a decimal with microseconds
  var oldNow = Date.now
  Date.now = function() {
    return Math.floor(oldNow.apply(this))
  }

  var oldValueOf = Date.prototype.valueOf
  Date.prototype.valueOf = function () {
    return Math.floor(oldValueOf.apply(this, arguments))
  }

  // V7's [].join doesnt work well if the last item is a string
  var originalJoin = Array.prototype.join
  function fixedJoin(ary, sep) {
    /*
    if (ary[ary.length - 1] !== '') {
      return originalJoin.apply(ary, arguments)
    }
    */
    if (sep == null) {
      sep = ','
    }

    var ret = ''

    for (var i = 0; i < ary.length; i++) {
      ret += ary[i]
      if (i < ary.length - 1) {
        ret += sep
      }
    }

    return ret
  }
  Array.prototype.join = function (sep) {
    return fixedJoin(this, sep)
  }

  var easyRegex = new RegExp('^[a-zA-Z0-9\\.\\-/_]+$')
  function replaceFn(_, leadingSlashOrColon, $1, $2) {
    if (leadingSlashOrColon) {
      return _
    }
    if (easyRegex.test($1)) {
      return _
    }
    if ($1[0] === ' ') {
      // HACK to avoid taking chain divisions as regex
      return _
    }
    var ret = 'new RegExp(' + JSON.stringify($1) + ', ' + JSON.stringify($2) + ')'
    return ret
  }

  var re = new RegExp('([:/\.])?/((?![*+?])(?:[^\\r\\n\\[/\\\\]|\\\\.|\\[(?:[^\\r\\n\\]\\\\]|\\\\.)*\\])+)/((?:g(?:im?|mi?)?|i(?:gm?|mg?)?|m(?:gi?|ig?)?)?)', 'g')
  var bypassMassageRegex = {
    'node/lib/assert.js': true,
    'node/lib/util.js': true,
    'node/lib/events.js': true,
    'node/lib/stream.js': true,
    'node/lib/_stream_readable.js': true,
    'node/lib/_stream_writable.js': true,
    'node/lib/_stream_duplex.js': true,
    'node/lib/_stream_transform.js': true,
    'node/lib/_stream_passthrough.js': true,
  }
  var bufferFilename = 'node/lib/buffer.js'
  global._hacks.massageRegex = function (x, filename) {
    filename = filename || ''
    if (bypassMassageRegex[filename] || filename.slice(-( bufferFilename.length )) === bufferFilename) {
      return x
    }

    if (_hacks.reactMassageShortcut(filename)) {
      return x
    }
    if (/\/\/ NO_MASSAGE_REGEX/.test(x)) {
      return x
    }
    // v7 doesn't support all the regexen in the wild.
    // Use the above regex to detect regexen in code (hack)
    // and replace it with new RegExp(...re)

    var rett = x.split('\n')

    var ret = rett.map(function(s) {
      var ret = _hacks.reactMassageLine(s, filename)
      if (ret) {
        return ret
      }
      if (!s || s.length < 10 || s[0] === '/' || s[1] === '/' || s[2] === '*') {
        return s
      }
      var replaced = s.replace(re, replaceFn)
      return replaced
    });

    var joined = ret.join('\n')

    return joined
  }

  process.argv[1] = process.binding('realpath')(process.argv[1])

  process.exit = process.binding('process_exit');

  process.env = {};
  process.binding('process_env')().forEach(function (item) {
    var splits = item.split('=')
    process.env[splits[0]] = splits.slice(1).join('=')
  })

  Object.freeze = function (o) { return o }
})()
