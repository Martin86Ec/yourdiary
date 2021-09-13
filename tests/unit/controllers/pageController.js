"use strict"

require("mocha")
const { assert } = require("chai")
const pageFixture = require("../../fixtures/page")
const sinon = require("sinon")
const pageController = require("../../../controllers/pageController")
let pages, pageModelStub = null

describe("pageController", () => { 
  pageModelStub = {
    createPage: sinon.stub(),
    readPage: sinon.stub(),
    updatePage: sinon.stub(),
    deletePage: sinon.stub()
  }

  pages = [
    pageFixture.extendObject("title 1", "content 1"), //should create and find it
    pageFixture.extendObject("title 2", "content 2"), //should not create, should not find, should not update, should not delete
    pageFixture.extendObject("title 3", "content 3"), //should create, find and update
    pageFixture.extendObject("title 4", "content 4")  //should create, delete, and don't find it
  ]

  pageModelStub.createPage.withArgs(pages[0]).returns({ error: false, data: pages[0] })
  pageModelStub.createPage.withArgs(pages[1]).returns({ error: true, data: null })
  pageModelStub.createPage.withArgs(pages[2]).returns({ error: false, data: pages[2] })
  pageModelStub.createPage.withArgs(pages[3]).returns({ error: false, data: pages[3] })

  describe("#get", () => {
    it("should return a middleware function", () => {
      assert.isFunction(pageController.get)
    })
    it("should return an object with the page data", () => {
      let req = {}
      let res = {}
    })
  })
})
