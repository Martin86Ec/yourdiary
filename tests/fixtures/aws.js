"use strict"

class DynamoDB {
  static DocumentClient = class DocumentClient {
    constructor() {}

    DescribeTableCommand(table) {
      return table
    }

    async createTable(params, callback) {
      callback(false, { data: "empty" })
    }

    async put(params, callback) {
      callback(false, { data: "empty" })
    }

    async get(params, callback) {
      callback(false, { data: "empty" })
    }

    async update(params, callback) {
      callback(false, { data: "empty" })
    }

    async delete(params, callback) {
      callback(false, { data: "empty" })
    }
  }
}

module.exports = {
  DynamoDB
}

