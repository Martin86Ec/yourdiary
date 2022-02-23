"use strict"

const { exec, spawn } = require("child_process")
const args = process.argv.slice(2)
const chalk = require("chalk")
const boxen = require("boxen")

start()
verifyArgs()

function start() {
  const titleBox = boxen("Tests", { 
    padding: 1, margin: 67, 
    borderStyle: "doubleSingle", 
    borderColor: "green",
    title: "YourDiary"
  })
  console.log(titleBox)
}

function verifyArgs() {
  let started = false

  if(args.length === 0) {
    console.group()
    console.log("Usage: test <option>\n")
    console.log("Where <option> is:")
    console.log("\tunit --unit -u")
    console.log("\tintegration --integration -i")
    console.groupEnd()
  } else if(args.length === 1){
    if(args[0] === "--unit" || args[0] === "-u") {
      startUnitTests()
    } else if(args[0] === "--integration" || args[0] === "-i") {
      started = startContainer()
      startIntegrationTests(true) 
    } else { 
      console.group()
      console.log(`<option>: ${args[0]} is not recognized. Available options: `)
      console.log("\tunit --unit -u")
      console.log("\tintegration --integration -i")
      console.groupEnd()
    }
  } else {
      console.group()
      console.log("Too many options. Please, use only one: ")
      console.log("\tunit --unit -u")
      console.log("\tintegration --integration -i")
      console.groupEnd()
  }
}

function startContainer() {
  console.group()
  console.log(chalk.blue("Verifying containers"))
  exec("docker ps -a | grep yourdiary_dynamodb", (error, stdout, stderr) => {
    if(error || stderr) {
      console.log(chalk.blue("\tyourdiary_dynamodb: "), chalk.red("container not found"))
      console.log(chalk.gray("\tattempting to create a new container..."))
      exec("docker run -d --name yourdiary_dynamodb -p 8000:8000 amazon/dynamodb-local", (error, stdout, stderr) => {
        if(error || stderr) {
          console.log(chalk.blue("\tyourdiary_dynamodb: "), chalk.red("cannot create the container"))
          console.log(chalk.red("Tests canceled"))
          groupEnd()
          return
        }
        console.log(chalk.blue("\tyourdiary_dynamodb: "), chalk.green("created"))
      })
    } else {
      console.log(chalk.blue("\tyourdiary_dynamodb: "), chalk.green("container found"))
      console.log(chalk.gray("\tattempting to start the found container..."))
      exec("docker start yourdiary_dynamodb", (error, stdout, stderr) => {
        if(error || stderr) {
          console.log(chalk.blue("\tyourdiary_dynamodb: ", chalk.red("cannot start the container")))
          console.groupEnd()
          return
        }
        console.log(chalk.blue("\tyourdiary_dynamodb: "), chalk.green("container started"))
      })
    }
  })
  console.groupEnd()
}


function startUnitTests() {
  spawn("./node_modules/.bin/mocha", ["tests/unit/*/*"], { stdio: "inherit" })
}

function startIntegrationTests(started) {
  if(!started) {
    return
  }

  spawn("./node_modules/.bin/mocha", ["tests/integration/*/*"], { stdio: "inherit" })
}
