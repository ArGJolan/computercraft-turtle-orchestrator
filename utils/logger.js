/* eslint-disable no-console */
const colors = require('./colors')
const timestamp = require('./timestamp')

// TODO: Use better logger
module.exports = {
  debug: (...args) => {
    console.log(`${timestamp()} ${colors.BLUE}DEBUG ${colors.RESTORE}:`, ...args)
  },
  info: (...args) => {
    console.log(`${timestamp()} ${colors.GREEN}INFO  ${colors.RESTORE}:`, ...args)
  },
  warn: (...args) => {
    console.log(`${timestamp()} ${colors.YELLOW}WARN ${colors.RESTORE}:`, ...args)
  },
  error: (...args) => {
    console.log(`${timestamp()} ${colors.RED}ERROR ${colors.RESTORE}:`, ...args)
  },
  trace: (...args) => {
    console.log(`${timestamp()} ${colors.CYAN}TRACE ${colors.RESTORE}:`, ...args)
  },
  stack: (...args) => {
    console.log(colors.RED, ...args, colors.RESTORE)
  }
}
