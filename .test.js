"use strict"

const { exec } = require("child_process")
const args = process.argv.slice(2)

exec("docker ps -a | grep yourdiary_dynamodb", (error, stdout, stderror) => {
  console.group()
  if(error || stderror) {
    console.log("Docker container not found, creating an instance: ")
    exec("docker run -d --name yourdiary_dynamodb -p 8000:8000 amazon/dynamodb-local", (error, stdout, stderror) => {
      if(error || stderror) {
        console.log("Cannot create docker container")
        console.groupEnd()
        return
      }
      console.log("Container created")
      console.groupEnd()
    })
  } else {
    console.log("Container already exists, starting: \n", stdout)
    exec("docker start yourdiary_dynamodb", (error, stdout, stderror) => {
      if(error || stderror) {
        console.log("Cannot start docker container, maybe it is already started.")
      }
    })
    console.groupEnd()
  }
})

console.group()
args.forEach((arg) => {
  if(arg === '-u' || arg === '--unit' ) {
    console.log("Starting unit tests: \n") 
    exec("./node_modules/.bin/mocha ./tests/unit/*", (error, stdout) => {
      console.log(stdout)
    })
  } else if(arg === '-i' || arg === '--integration') {
    console.log("Starting integration tests: \n") 
    exec("./node_modules/.bin/mocha ./tests/integration/*")
  } else {
    console.log("no option passed.")
    console.log("Allowed options: \n -u | --u  unit tests \n -i | --integration  integration tests")
  }
})
console.groupEnd()
