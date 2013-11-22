"use strict"

var assert = require("./assert")
var Histogram = require("../lib/histogram")

function iter(iterator) {
  var values = []
  for (var res; !(res = iterator.next()).done; ) {
    values.push(res.value)
  }
  return values
}

describe("Histogram", function() {
  var hist

  beforeEach(function() {
    hist = new Histogram(0.1)
  })

  describe("quantiles", function() {
    it("should return iterator", function() {
      assert.equal(typeof hist.quantiles().next, "function")
    })

    it("should throw when iterating empty histogram", function() {
      assert.throws(iter.bind(this, hist.quantiles()), TypeError)
    })

    it("should return few quantiles for small data set", function() {
      hist.record(5)
      assert.equal(iter(hist.quantiles()).length, 1)
    })

    it("should return many quantiles for larger data set", function() {
      for (var i = 1; i < 1000; i++) hist.record(i)
      assert.equal(iter(hist.quantiles()).length, 3)
    })

    it("should return single value as first quantile", function() {
      hist.record(5)
      assert.near(iter(hist.quantiles())[0].value, 5, 0.2)
    })

    it("should return first number as first quantile", function() {
      hist = new Histogram(0.001)
      hist.record(5), hist.record(5)
      assert.near(iter(hist.quantiles())[0].value, 5, 0.01)
    })

    it("should return interpolated value between bins in sparse hist", function() {
      hist = new Histogram(0.001)
      hist.record(5), hist.record(10), hist.record(20)
      assert.near(iter(hist.quantiles())[0].value, 18, 0.01)
    })

    it("should return interpolated value between bins in dense hist", function() {
      for (var i = 0; i < 900; i++) hist.record(5)
      for (var i = 0; i < 100; i++) hist.record(5.5)
      assert.near(iter(hist.quantiles())[0].value, 5, 0.5)
    })

    it("should return interpolated value between bins in dense hist", function() {
      for (var i = 1; i < 1200; i++) hist.record(i)
      // console.log(iter(hist.quantiles(5)))
      assert.near(iter(hist.quantiles(5))[0].value, 425, 40)
    })

    it("should return quantiles with values by steps", function() {
      hist.record(1), hist.record(2)
      assert.equal(iter(hist.quantiles(5))[4].k, 0.9)
    })
  })
})
