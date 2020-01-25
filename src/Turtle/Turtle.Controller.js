const Service = require('../Service')

class TurtleController extends Service {
  /**
   * Initialize the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  async _init (app) {
    await super._init(app)
    // Async init goes here

    // Do not forget to call that for every service or your app could be frozen
    this.setServiceReady()
  }

  /**
   * Create a turtle group
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async createGroup (req, res, next) {
    this.logger.trace('TurtleController.createGroup')

    try {
      const result = await this.TurtleService.createGroup()
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * Create a turtle
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async createTurtle (req, res, next) {
    this.logger.trace('TurtleController.createTurtle')

    try {
      const result = await this.TurtleService.createTurtle(req.params.groupUuid)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * Get next turtle action
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async getNextAction (req, res, next) {
    this.logger.trace('TurtleController.getNextAction')

    try {
      const result = await this.TurtleService.getNextAction(req.params)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * Add a block to group blacklist
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async addToBlacklist (req, res, next) {
    this.logger.trace('TurtleController.addToBlacklist')

    try {
      const result = await this.TurtleService.addToBlacklist(req.params.groupUuid)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * Get a group blacklist
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async getBlacklist (req, res, next) {
    this.logger.trace('TurtleController.getBlacklist')

    try {
      const result = await this.TurtleService.getBlacklist(req.params.groupUuid, req.body.block)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }

  /**
   * Delete a block from a group blacklists
   *
   * @param {Object} req - express req object
   * @param {Object} res - express res object
   * @param {Function} next - express next callback
   */
  async deleteFromBlacklist (req, res, next) {
    this.logger.trace('TurtleController.deleteFromBlacklist')

    try {
      const result = await this.TurtleService.deleteFromBlacklist(req.params)
      res.send(result)
    } catch (e) {
      next(e)
    }
  }
}

module.exports = TurtleController
