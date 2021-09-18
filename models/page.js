"use strict"

const aws = require("aws-sdk")
let dynamodb = null
let documentClient = null

if(!dynamodb) {
  aws.config.update({ region: "us-east-1",
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
  let error, response = null
  const params = {
    TableName: "pages",
    Item: {
      ...page
    }
  }

  await documentClient.put(params, (err, data) => {
    if(err){
      error = true
      console.log(`Unable to create the page ${params.Item.title}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      error = false
      console.log(`Page ${params.Item.title} created.`)
    }
    response = data
  })

  return { error, response }
}

async function readPage(pageTitle, content) {
  let error, response = null
  const params = {
    TableName: "pages",
    Key: {
      title: pageTitle,
      content: content
    }
  }
  await documentClient.get(params, (err, data) => {
    if(err) {
      error = true
      console.log(`Unable to read the page ${pageTitle}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      error = false
      console.log(`Page ${pageTitle} found: `, JSON.stringify(data))
    }
    response = data
  })

  return { error, response }
}

async function updatePage(page, values) {
  let error, response = null
  const params = {
    TableName: "pages",
    Key: {
      title: page.title,
      content: page.content
    },
    UpdateExpression: "set title = :t, content=:c",
    ExpressionAttributeValues: {
      ":t": values.title,
      ":c": values.content
    },
    ReturnValues:"UPDATED_NEW"
  }
  await documentClient.update(params, (err, data) => {
    if(err) {
      error = true
      console.log(`Unable to update the page ${page.title}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      error = false
      console.log(`Page ${page.title} updated: `, JSON.stringify(data))
    }
    response = data
  })

  return { error, response }
}

async function deletePage(page) {
  let error, response = null
  const params = {
    TableName: "pages",
    Key: {
      title: page.title,
      content: page.content
    },
    conditionExpression: "title = :t",
    ExpressionAttributeValues: {
      ":t": page.title,
    },
    ReturnValues:"UPDATED_NEW"
  }
  await documentClient.delete(params, (err, data) => {
    if(err) {
      error = true
      console.log(`Unable to read the page ${page.title}. Error JSON: `, JSON.stringify(err, null, 2))
    } else {
      error = false
      console.log(`Page ${page.title} deleted: `, JSON.stringify(data))
    }
    response = data
  })

  return { error, response }
}

module.exports = {
  createTable,
  createPage,
  readPage,
  updatePage,
  deletePage
}
