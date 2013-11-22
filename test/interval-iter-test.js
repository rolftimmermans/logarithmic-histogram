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

  describe("intervals", function() {
    it("should return iterator", function() {
      assert.equal(typeof hist.intervals().next, "function")
    })

    it("should return empty list when iterating empty histogram", function() {
      assert.deepEqual(iter(hist.intervals()), [])
    })

    it("should return list with length of histogram", function() {
      hist.record(5), hist.record(7), hist.record(9), hist.record(11)
      assert.equal(iter(hist.intervals()).length, hist.length)
    })

    it("should return list with interval value", function() {
      hist.record(956)
      assert.near(iter(hist.intervals())[0].value, 956)
    })

    it("should return list with interval quantity", function() {
      for (var i = 0; i < 21; i++) hist.record(10)
      assert.equal(iter(hist.intervals())[0].q, 21)
    })
  })
})
