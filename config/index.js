const { merge } = require('lodash')
const path = require('path')

const defaultConfig = require(path.resolve('./config/config'))

let envConfig

try {
  envConfig = require(path.resolve(`./config/config.${process.env.NODE_ENV.toLowerCase()}`))
} catch (e) {}

let localConfig

try {
  localConfig = require(path.resolve('./config/config.local'))
} catch (e) {}

module.exports = merge({}, defaultConfig, envConfig, localConfig)
