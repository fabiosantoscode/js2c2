(function () {
  var oldValueOf = Date.prototype.valueOf
  Date.prototype.valueOf = function () {
    return Math.floor(oldValueOf.apply(this, arguments))
  }
})()
