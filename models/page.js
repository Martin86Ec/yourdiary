"use strict"

const aws = require("aws-sdk")
let dynamodb = null
let documentClient = null

if(!dynamodb) {
  aws.config.update({
    region: "us-east-1",
    accessKeyId: "xxx",
    secretAccessKey: "xxx",
    endpoint: "http://localhost:8000"
  })
  dynamodb = new aws.DynamoDB()
  documentClient = new aws.DynamoDB.DocumentClient()
}

async function createTable() {
  try{  
    dynamodb.DescribeTableCommand("pages")
    console.log("Pages table exists, aborting creation.", null, 2) 
    return
  } catch(err) {
    console.log("Creating table")
  }

  const params = {
    TableName: "pages",
    KeySchema: [
      { AttributeName: "content", KeyType: "HASH" },
      { AttributeName: "title", KeyType: "RANGE" }
    ],
    AttributeDefinitions: [
      { AttributeName: "content", AttributeType: "S" },
      { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }

  dynamodb.createTable(params, (err, data) => {
    if(err) {
      console.log("Unable to create Table. Error JSON:", JSON.stringify(err, null, 2))
    } else {
      console.log("Create table. Table description. JSON:", JSON.stringify(data, null, 2))
    }
  })
}

async function createPage(page) {
  const params = {
    TableName: "pages",
    Item: {
      ...page
    }
  }
  await documentClient.put(params, (err, data) => {
    if(err){
      console.log(`Unable to create the page ${page.title}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      console.log(`Page ${page.title} created.`)
    }
  })
}

async function readPage(pageTitle, content) {
  const params = {
    TableName: "pages",
    Key: {
      title: pageTitle,
      content: content
    }
  }
  await documentClient.get(params, (err, data) => {
    if(err) {
      console.log(`Unable to read the page ${pageTitle}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      console.log(`Page ${pageTitle} found: `, JSON.stringify(data))
      return JSON.stringify(data)
    }
  })
}

async function updatePage(page) {}

async function deletePage(pageId) {}

module.exports = {
  createTable,
  createPage,
  readPage
}
