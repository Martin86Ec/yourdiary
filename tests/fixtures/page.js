"use strict"

const rawPage = {
  title: "Raw Title",
  content: "Raw content"
}

module.exports = {
  extendObject: (title, content) => {
    let clone = Object.assign({}, rawPage)
    return Object.assign(clone, { title, content })
  }
}
