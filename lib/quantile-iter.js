"use strict"

function QuantileIter(hist, steps) {
  steps = steps || 1

  this.i = 0
  this.n = Math.max(1, Math.round(Math.log(hist.size) / Math.log(10))) * steps

  this.hist = hist
  this.base = Math.exp(Math.log(0.1) / steps)
  this.position = hist.offset
  this.num = -1
}

QuantileIter.prototype.next = function() {
  if (this.hist.size == 0) throw new TypeError("Cannot iterate empty histogram")
  if (this.i == this.n) return {done: true}

  var k = 1 - 1 * Math.pow(this.base, ++this.i)
  var n = (this.hist.size - 1) * k

  var count, previous
  while (this.num < this.hist.size && this.num < n) {
    count = this.hist.countAt(this.position++)
    if (count) {
      if ((this.num += count) < n) previous = this.position
    }
  }

  var value = this.hist.valueAt(this.position - 0.5)
  if (this.num - count > n - 1 && previous) {
    var diff = this.hist.valueAt(previous - 0.5) - value
    var overflow = (this.num - count - n + 1)
    value += diff * overflow
  }

  return {
    done: false,
    value: {k: k, value: value}
  }
}

module.exports = QuantileIter
