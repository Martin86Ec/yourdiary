"use strict"

const pageModel = require("../models/page")

module.exports = {
  get: async function(req, res, next) {
    if(req.params.title && req.params.content) {
      const result = await pageModel.readPage({
        title: req.params.title,
        content: req.params.content
      })
      res.send(result)
    } else {
      res.send({ error: true, data: null }) }
  },
  post: async function(req, res, next) {
    if(req.params.title && req.params.content) {
      const result = await pageModel.createPage({
        title: req.params.title,
        content: req.params.content
      })
      res.send(result)
    } else {
      res.send({ error: true, data: null })
    }
  },
  put: async function(req, res, next) {
    if(req.params.page && req.params.values) {
      const result = await pageModel.updatePage(req.params.page, req.params.values)
      res.send(result)
    } else {
      res.send({ error: true, data: null })
    }
  },
  delete: async function(req, res, next) {
    if(req.params.page) {
      const result = await pageModel.deletePage(req.params.page)
      res.send(result)
    } else {
      res.send({ error: true, data: null })
    }
  }
}
