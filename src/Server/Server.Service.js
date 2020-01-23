const Service = require('../Service')
const express = require('express')
const cors = require('cors')
const http = require('http')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

class ServerService extends Service {
  /**
   * Initialize the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  async _init (app) {
    // Don't forget to call this bad boi
    await super._init(app)

    // eslint-disable-next-line no-async-promise-executor
    this.server = express()

    if (this.config.cors) {
      this.server.use(cors(this.config.cors))
    }

    this.server.use(this.httpLogger.bind(this))
    this.server.use(bodyParser.json({ limit: '80mb' }))
    this.server.use(cookieParser())

    for (const routeName of Object.keys(this.config.routes)) {
      const route = this.config.routes[routeName]
      const {
        http,
        path,
        controller,
        method
      } = route

      if (!this[`${controller}Controller`]) {
        throw new Error(`In route "${routeName}": Service ${`${controller}Controller`} is missing, did you forget to declare it in config?`)
      }
      if (!this[`${controller}Controller`][method]) {
        throw new Error(`In route "${routeName}": Method ${method} is missing in service ${`${controller}Controller`}, did you forget to declare it?`)
      }

      if (path) {
        this.server[http || 'use'](path, (req, res, next) => this[`${controller}Controller`][method](req, res, next))
      } else {
        this.server[http || 'use']((req, res, next) => this[`${controller}Controller`][method](req, res, next))
      }
    }

    this.server.use(express.static('static'))

    this.server.use((req, res) => {
      res.status(404).send()
    })

    this.server.use(this.errorHandling.bind(this))

    await this._listen()
    this.setServiceReady()
  }

  /**
   * Create http server and listen
   */
  async _listen () {
    return new Promise(resolve => {
      this.httpServer = http.createServer(this.server)

      this.httpServer.listen(this.config.port, this.config.host, () => {
        this.logger.info('💻', `Running on http://${this.config.host}:${this.config.port}`)
        resolve()
      })
    })
  }

  /**
   * Http logger for express
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next middleware
   */
  httpLogger (req, res, next) {
    this.logger.info('💻', req.method, req.originalUrl, 'from', req.ip)
    next()
  }

  /**
   * Error handler for express
   *
   * @param {Error} err - Error thrown
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next middleware
   */
  errorHandling (err, req, res, next) {
    if (!err.status) {
      err.status = 400
    }
    res.status(err.status)
    res.json({ error: err.message })
    this.logger.error(err.message)
    this.logger.stack(err.stack)
  }
}

module.exports = ServerService
