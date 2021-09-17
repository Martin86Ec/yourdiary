"use strict"

require("mocha")
const { assert } = require("chai")
const pageModel = require("../../../models/page")

describe("pageModel", () => {
  it("should create a page", async () => {
    const data = {
      title: "title test 1",
      content: "content test 1"
    }
    const result = await pageModel.createPage(data)

    assert.isNotNull(result)
    assert.isFalse(result.error)
    assert.deepEqual(result.data, data)
  })
})
