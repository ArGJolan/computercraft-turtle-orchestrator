/**
 * A Service component
 * You need to call `setServiceReady` in _init
 */
class Service {
  /**
   * Build the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  constructor (app) {
    const { config, name, logger } = app
    this.app = app
    this.config = config || {}
    this.logger = logger
    this.serviceName = name

    this.isServiceReady = new Promise(resolve => {
      this.setServiceReady = resolve
    }).then(data => {
      this.logger.info('✅', this.serviceName, 'ready')
      return data
    })
    this.logger.info('🔧', this.serviceName, 'created')
  }

  /**
   * Initialize the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  async _init (app) {
    // Not sure why we need to do that but the reference is somehow lost 🤷
    this.app = app
    for (const service of app.services) {
      this[service] = app[service]
    }
    if (this.config.waitFor && this.config.waitFor.length) {
      this.logger.info('🙈', this.serviceName, 'waiting for', this.config.waitFor.join(' & '))
      const servicesReady = this.config.waitFor.map(serviceName => app[serviceName].isServiceReady)
      await Promise.all(servicesReady)
    }
    this.logger.info('🔨', this.serviceName, 'initializing')
  }
}

module.exports = Service
