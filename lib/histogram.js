"use strict"

var IntervalIter = require("./interval-iter")
var QuantileIter = require("./quantile-iter")

function Histogram(error) {
  this.base = 1 + (error || 1/128)
  if (this.position(Number.MAX_VALUE) > Histogram.maxInt / 2) throw new RangeError("Error requirement too strict")

  this._data = []
  this.size = 0
  this.offset = Infinity
}

Histogram.maxInt = Math.pow(2, 53)

Histogram.prototype.__defineGetter__("length", function() {
  return this._data.length
})

Histogram.prototype.__defineGetter__("min", function() {
  if (this.length) return this.valueAt(this.offset)
})

Histogram.prototype.__defineGetter__("max", function() {
  if (this.length) return this.valueAt(this.offset + this.length)
})

Histogram.prototype.position = function(number) {
  if (number > Number.MAX_VALUE) throw new RangeError("Number too large")
  if (number < Number.MIN_VALUE) throw new RangeError("Number too small")

  return Math.floor(Math.log(number) / Math.log(this.base))
}

Histogram.prototype.record = function(number) {
  return this.incrementAt(this.position(number))
}

Histogram.prototype.countAt = function(position) {
  return this._data[position - this.offset] || 0
}

Histogram.prototype.incrementAt = function(position) {
  if (this.size++ == Histogram.maxInt) throw new RangeError("Histogramogram size exceeded")

  if (position < this.offset) {
    if (this.offset < Infinity) {
      this._data = new Array(this.offset - position).concat(this._data)
    }
    this.offset = position
  }

  return this._data[position - this.offset] = (this._data[position - this.offset] || 0) + 1
}

Histogram.prototype.valueAt = function(position) {
  return Math.pow(this.base, position)
}

Histogram.prototype.intervals = function() {
  return new IntervalIter(this)
}

Histogram.prototype.quantiles = function(steps) {
  return new QuantileIter(this, steps)
}

module.exports = Histogram
