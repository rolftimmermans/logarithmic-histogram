"use strict"

function IntervalIter(hist) {
  this.position = hist.offset
  this.last = hist.offset + hist.length

  this.hist = hist
}

IntervalIter.prototype.next = function() {
  if (this.position == this.last) return {done: true}

  var value = this.hist.valueAt(this.position)
  var q = this.hist.countAt(this.position)
  this.position++

  return {
    done: false,
    value: {q: q, value: value}
  }
}

module.exports = IntervalIter
