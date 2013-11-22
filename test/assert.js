"use strict"

var assert = require("assert")

assert.near = function(actual, expected, precision) {
  if (Math.abs(actual - expected) > (precision || 0.1 * expected) || !actual) {
    assert.fail(actual, expected, null, "=~")
  }
}

module.exports = assert
