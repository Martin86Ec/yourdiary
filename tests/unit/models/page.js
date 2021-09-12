"use strict"

require("mocha")
const { assert } = require("chai")
const sinon = require("sinon")
const proxyquire = require("proxyquire")
const awsFixture = require("../../fixtures/aws")
const pageModel = proxyquire("../../../models/page", {
  "aws-sdk": awsFixture
})

describe("pageModel", async () => {
  it("#createPage Should return a two key object", async () => {
    let { error, response } = await pageModel.createPage({ title: "test page" })
    assert.isNotNull(response, "error should not be null")
    assert.isFalse(error, "error should be false")
  })
  it("#getPage should return a two key object", async () => {
    let { error, response } = await pageModel.readPage("test title", {})
    assert.isNotNull(response, "should not be null")
    assert.isFalse(error, "error should be false")
  })
  it("#updatePage should return a two key object", async () => {
    let { error, response } = await pageModel.updatePage("test title", {})
    assert.isNotNull(response, "should not be null")
    assert.isFalse(error, "error should be false")
  })
  it("#deletePage should return a two key object", async () => {
    let { error, response } = await pageModel.deletePage("test title", {})
    assert.isNotNull(response, "should not be null")
    assert.isFalse(error, "error should be false")
  })
})
