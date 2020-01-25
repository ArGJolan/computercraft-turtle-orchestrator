const Service = require('../Service')
const request = require('request-promise')

class SSOService extends Service {
  /**
   * Build the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  constructor (app) {
    super(app)

    this.headers = {
      Authorization: this.config.apiKey,
      'X-Service-Name': this.app.pkg.name
    }
  }

  /**
   * Initialize the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  async _init (app) {
    await super._init(app)

    this.setServiceReady()
  }

  /**
   * Create a service user
   *
   * @param {Object} userInfo - User information
   * @param {String} userInfo.email - email of the user
   * @param {String} userInfo.password - Password of the user
   * @param {Boolean} userInfo.disableLogin - Disbale SSO Login
   * @param {Object} userInfo.servicePermission - Permission related to the service
   * @param {Object} userInfo.additionnalInformation - Additional info
   */
  async createServiceUser (userInfo) {
    this.logger.trace('SSOService.createUser')

    const { email, password, disableLogin, servicePermissions, additionnalInformation } = userInfo

    const result = await request(`${this.config.endpoint}/external/service-user`, {
      method: 'POST',
      headers: this.headers,
      body: {
        email,
        password,
        disableLogin,
        servicePermissions,
        additionnalInformation
      },
      json: true
    })

    this.logger.debug(result)
  }
}

module.exports = SSOService
