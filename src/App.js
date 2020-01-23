const { upperFirst } = require('lodash')
const { logger, sleep, usleep, array } = require('../utils')

class App {
  /**
   * Build the services
   *
   * @param {Object} config - The configuration of the application
   */
  constructor (config) {
    this.logger = logger
    this.config = config
    this._configLoader()
    this.usleep = usleep
    this.sleep = sleep
    this.arrayUtils = array

    this.services = []
    const services = Object.keys(config.services)
    for (const serviceName of services) {
      const upperFirstServiceName = upperFirst(serviceName)
      const fullServiceName = `${upperFirstServiceName}Service`
      const Service = require(`./${upperFirstServiceName}/${upperFirstServiceName}.Service`)

      this[fullServiceName] = new Service({ ...this, config: config.services[serviceName], globalConfig: config, name: fullServiceName })

      this.services.push(fullServiceName)

      try {
        const controllerName = `${upperFirstServiceName}Controller`
        const Controller = require(`./${upperFirstServiceName}/${upperFirstServiceName}.Controller`)

        this[controllerName] = new Controller({ ...this, config: config.controllers[serviceName], globalConfig: config, name: controllerName })

        this.services.push(controllerName)
      } catch (e) {
        // A controller is not always needed
      }
    }
  }

  /**
   * Return the actual path of current config from upper case path
   *
   * @param {Array<String>} configPath - Array of uppercase keys
   */
  _findConfigPath (configPath) {
    let currentConfig = this.config
    const newPath = []

    for (const key of configPath) {
      const currentLevelKeys = Object.keys(currentConfig)

      const actualKey = currentLevelKeys.find(currentLevelKey => currentLevelKey.toLowerCase() === key.toLowerCase()) || key.toLowerCase()
      currentConfig = currentConfig[actualKey] || {}
      newPath.push(actualKey)
    }

    return newPath.join('.')
  }

  /**
   * Assign a value to a deep object in config
   * See https://stackoverflow.com/questions/18936915/dynamically-set-property-of-nested-object
   *
   * @param {String} path - Path of config to set, separated by '.'
   * @param {*} value - Value to assign
   */
  _setConfig (path, value) {
    let schema = this.config
    const pList = path.split('.')
    const len = pList.length
    for (let i = 0; i < len - 1; i++) {
      const elem = pList[i]
      if (!schema[elem]) {
        schema[elem] = {}
      }
      schema = schema[elem]
    }

    try {
      schema[pList[len - 1]] = JSON.parse(value)
    } catch (e) {
      schema[pList[len - 1]] = value
    }
  }

  /**
   * Load and edit config from config file and env
   */
  _configLoader () {
    this.logger.trace('App.configLoader')

    const configKeys = Object.keys(process.env).filter(key => key.startsWith('APPCONFIG_'))

    for (const key of configKeys) {
      const splitKey = key.split('_')
      splitKey.shift()

      const configPath = this._findConfigPath(splitKey)
      this.logger.info('💾', `Assigned ${key} value to ${configPath}`)
      this._setConfig(configPath, process.env[key])
    }
  }

  /**
   * Start the application by running _init on all services
   */
  async start () {
    try {
      await Promise.all(this.services.map(serviceName => this[serviceName]._init(this)))
      this.logger.info('🎉', 'App is now ready and running')
    } catch (err) {
      this.logger.error('❌', 'App crashed!')
      this.logger.stack(err)
      process.exit(1)
    }
  }
}

module.exports = App
