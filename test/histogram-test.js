"use strict"

var assert = require("./assert")
var Histogram = require("../lib/histogram")

describe("Histogram", function() {
  var hist

  beforeEach(function() {
    hist = new Histogram(0.1)
  })

  describe("constructor", function() {
    it("should calculate base", function() {
      assert.equal(new Histogram(0.02).base, 1.02)
    })

    it("should throw range error for too small error", function() {
      assert.throws(function() { new Histogram(0.00000000000001) }, RangeError)
    })
  })

  describe("position", function() {
    it("should return position for one", function() {
      assert.equal(hist.position(1), 0)
    })

    it("should return position for fraction", function() {
      assert.equal(hist.position(0.9), -2)
    })

    it("should return position for two", function() {
      assert.equal(hist.position(2), 7)
    })

    it("should return position for large integers", function() {
      assert.equal(hist.position(4294967296), 232)
    })

    it("should return position for enormous floats", function() {
      assert.equal(hist.position(9007199254740992), 385)
    })

    it("should return position for max number", function() {
      assert.equal(hist.position(Number.MAX_VALUE), 7447)
    })

    it("should throw range error for infinity", function() {
      assert.throws(hist.position.bind(hist, Infinity), RangeError)
    })

    it("should throw range error for zero", function() {
      assert.throws(hist.position.bind(hist, 0), RangeError)
    })

    it("should throw range error for number smaller than zero", function() {
      assert.throws(hist.position.bind(hist, -0.0000001), RangeError)
    })
  })

  describe("countAt", function() {
    it("should return zero", function() {
      assert.equal(hist.countAt(4), 0)
    })
  })

  describe("valueAt", function() {
    it("should return value for zero", function() {
      assert.equal(hist.valueAt(0), 1)
    })

    it("should return value for three", function() {
      assert.near(hist.valueAt(3), 1.331, 0.01)
    })

    it("should return value for minus three", function() {
      assert.near(hist.valueAt(-3), 0.751, 0.01)
    })

    it("should return value for max number", function() {
      assert.near(hist.valueAt(7447), Number.MAX_VALUE, Number.MAX_VALUE * 0.01)
    })

    it("should return value for min number", function() {
      assert.near(hist.valueAt(-7447), 5e-309, 1e-309)
    })

    it("should return value that is lower than original", function() {
      assert.ok(hist.valueAt(hist.position(12345.25)) < 12345.25)
    })
  })

  describe("incrementAt", function() {
    it("should set offset", function() {
      hist.incrementAt(3)
      assert.equal(hist.offset, 3)
    })

    it("should increase offset", function() {
      hist.incrementAt(7)
      hist.incrementAt(5)
      assert.equal(hist.offset, 5)
    })

    it("should return one", function() {
      assert.equal(hist.incrementAt(3), 1)
    })

    it("should return two the second time", function() {
      hist.incrementAt(7)
      assert.equal(hist.incrementAt(7), 2)
    })

    it("should return two the second time with negative position", function() {
      hist.incrementAt(-7)
      assert.equal(hist.incrementAt(-7), 2)
    })

    it("should allow max size to be reached", function() {
      hist.size = Histogram.maxInt - 1
      hist.incrementAt(8)
      assert.equal(hist.size, Histogram.maxInt)
    })

    it("should throw error if invoked after max size is reached", function() {
      hist.size = Histogram.maxInt
      assert.throws(hist.incrementAt.bind(hist, 6), RangeError)
    })
  })

  describe("length", function() {
    it("should return zero without data", function() {
      assert.equal(hist.length, 0)
    })

    it("should return one for single data point", function() {
      hist.incrementAt(7)
      assert.equal(hist.length, 1)
    })

    it("should return spread between first and last point", function() {
      hist.incrementAt(8)
      hist.incrementAt(-8)
      assert.equal(hist.length, 17)
    })
  })

  describe("record", function() {
    it("should increment bin to one", function() {
      hist.record(2)
      assert.equal(hist.countAt(7), 1)
    })

    it("should increment bin repeatedly", function() {
      hist.record(2), hist.record(2.1), hist.record(2.05)
      assert.equal(hist.countAt(7), 3)
    })

    it("should increment bin after histogram extension", function() {
      hist.record(2), hist.record(10), hist.record(0.01), hist.record(2.1)
      assert.equal(hist.countAt(7), 2)
    })
  })

  describe("min", function() {
    it("should return undefined if empty", function() {
      assert.equal(hist.min, undefined)
    })

    it("should close to and less than minimum value", function() {
      hist.record(2), hist.record(10), hist.record(0.1)
      assert.near(hist.min, 0.1, 0.01)
      assert.ok(hist.min < 0.1)
    })
  })

  describe("max", function() {
    it("should return undefined if empty", function() {
      assert.equal(hist.min, undefined)
    })

    it("should close to and more than maximum value", function() {
      hist.record(2), hist.record(10), hist.record(0.1)
      assert.near(hist.max, 10, 1)
      assert.ok(hist.max > 10)
    })
  })
})
