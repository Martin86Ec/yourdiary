"use strict"
require("mocha")
const { assert } = require("chai")
const sinon = require("sinon")
const proxyquire = require("proxyquire")
const pageFixture = require("../../fixtures/page")
let pageController = null
let pages, pageModelStub = null
let req, res = null

describe("pageController", () => { 
  pages = [
    pageFixture.extendObject("title 1", "content 1"),
    pageFixture.extendObject("title 2", "content 2"),
    pageFixture.extendObject("title 3", "content 3"),
    pageFixture.extendObject("title 4", "content 4")
  ]
  pageModelStub = {
    createPage: sinon.stub(),
    readPage: sinon.stub(),
    updatePage: sinon.stub(),
    deletePage: sinon.stub()
  }

  beforeEach(() => {
    pageController = proxyquire("../../../controllers/pageController", {
      "../models/page": pageModelStub
    })
    req = {
      params: null
    }
    res = {
      response: null,
      send: (object) => { res.response = object }
    }
  })

  describe("#get", () => {
    pageModelStub.readPage.withArgs(pages[0]).returns({ error: true, data: null })
    pageModelStub.readPage.withArgs(pages[1]).returns({ error: false, data: pages[1] })

    it("should return a middleware function", () => {
      assert.isFunction(pageController.get)
    })
    it("should return an object with the page data", async () => {
      req.params = pages[1]
      await pageController.get(req, res)
      assert.isFalse(res.response.error)
      assert.isNotNull(res.response.data.title)
      assert.isNotNull(res.response.data.content)
      assert.deepEqual(res.response.data, pages[1])
    })
    it("should return an object with error and no data", async () => {
      req.params = pages[0]
      await pageController.get(req, res)
      assert.isTrue(res.response.error)
      assert.isNull(res.response.data)
    })
  })

  describe("#post", () => {
    pageModelStub.createPage.withArgs(pages[0]).returns({ error: true, data: null })
    pageModelStub.createPage.withArgs(pages[1]).returns({ error: false, data: pages[1] })
    pageModelStub.createPage.withArgs(pages[2]).returns({ error: false, data: pages[2] })
    pageModelStub.createPage.withArgs(pages[3]).returns({ error: false, data: pages[3] })
    it("should return a middleware function", () => {
      assert.isFunction(pageController.post)
    })
    it("should return an object with the created page data", async () => {
      for(let i = 1; i < pages.length; i++) {
        req.params = pages[i]
        await pageController.post(req, res)
        assert.isNotNull(res.response.error)
        assert.isNotNull(res.response.data)
        assert.isFalse(res.response.error)
        assert.deepEqual(res.response.data, pages[i])
      } })
    it("should return a true error and no data", async () => {
      req.params = pages[0]
      await pageController.post(req, res)
      assert.isNull(res.response.data)
      assert.isTrue(res.response.error)
    })
  })

  describe("#put", () => {
    pageModelStub.updatePage.withArgs(pages[0]).returns({ error: true, data: null })
    pageModelStub.updatePage.withArgs(pages[1]).returns({ error: false, data: pages[1] })
    pageModelStub.updatePage.withArgs(pages[2]).returns({ error: false, data: pages[2] })
    pageModelStub.updatePage.withArgs(pages[3]).returns({ error: false, data: pages[3] })
    it("should return a middleware", () => {
        assert.isFunction(pageController.put)
    })
    it("should return an object with the updated page data", async () => {
      for(let i = 1; i < pages.length; i++) {
        let newData = Object.assign({}, pages[i])
        newData.title = "updated"
        req.params = {
          page: pages[i],
          values: newData
        }
        await pageController.put(req, res)
        assert.isNotNull(res.response.error)
        assert.isNotNull(res.response.datq)
        assert.isFalse(res.response.error)
        assert.deepEqual(res.response.data, pages[i])
      }
    })
    it("should return and error and no data", async () => {
      let newData = Object.assign({}, pages[0])
      newData.title = "updated"
      req.params = {
        page: pages[0],
        values: newData }
      await pageController.put(req, res)
      assert.isTrue(res.response.error)
      assert.isNull(res.response.data)
    })
  })

  describe("#delete", () => {
    pageModelStub.deletePage.withArgs(pages[0]).returns({ error: true, data: null })
    pageModelStub.deletePage.withArgs(pages[1]).returns({ error: false, data: pages[1] })
    pageModelStub.deletePage.withArgs(pages[2]).returns({ error: false, data: pages[2] })
    pageModelStub.deletePage.withArgs(pages[3]).returns({ error: false, data: pages[3] })
    it("should return the data of the deleted page", async () => {
      for(let i=1; i < pages.lenght; i++) {
        req.params = pages[i]
        await pageController.delete(req, res)
        assert.isFalse(res.response.error)
        assert.isNotNull(res.response.data)
        assert.deepEqual(res.response.data, pages[0])
      }
    })
   it("should return an error true and no data", async () => {
      req.params = pages[0]
      await pageController.delete(req, res)
      assert.isTrue(res.response.error)
      assert.isNull(res.response.data)
    })
  })
})
