const { merge } = require('lodash')
const path = require('path')

const defaultConfig = require(path.resolve('./config/config'))
let localConfig

try {
  localConfig = require(path.resolve('./config/config.local'))
} catch (e) {}

module.exports = merge({}, defaultConfig, localConfig)
