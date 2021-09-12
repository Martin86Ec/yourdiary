"use strict"

const pages = []

module.exports = {
  createTable: async (page) => {
    pages.push(page)
  }
}
