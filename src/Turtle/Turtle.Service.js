const Service = require('../Service')
const assert = require('assert')

class TurtleService extends Service {
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
   * Create a turtle group
   */
  async createGroup () {
    this.logger.trace('TurtleService.createGroup')

    const uuid = await this.DatabaseService.createGroup()
    const token = await this.SsoService.createServiceUser({
      email: `${this.config.emailPrefix}-${uuid}@${this.config.emailDomain}`,
      password: this.config.sso.password,
      disableLogin: true,
      servicePermissions: {
        group: {
          [uuid]: true
        }
      }
    })
    return token
  }

  /**
   * Create a turtle
   *
   * @param {String} groupUuid - The uuid of the group the turtle will belong to
   */
  async createTurtle (groupUuid) {
    this.logger.trace('TurtleService.createTurtle')

    assert(groupUuid, 'Must provide an groupUuid')
    return this.DatabaseService.createTurtle(groupUuid)
  }

  /**
   * If other turtles of the gorup are waiting, returns a new action uuid.
   * Otherwise, returns an empty string to indicate the turtle it needs to wait.
   *
   * @param {Object} turtleInfo - Info of the turtle
   * @param {String} turtleInfo.groupUuid - The uuid of the group the turtle belongs to
   * @param {String} turtleInfo.turtleUuid - The uuid of the turtle
   * @param {String} turtleInfo.oldJobUuid - The uuid of the old turtle job
   * @returns {String} - The next action to be done
   */
  async getNextAction (turtleInfo = {}) {
    this.logger.trace('TurtleService.getNextAction')

    const { groupUuid, turtleUuid, oldJobUuid = null } = turtleInfo

    assert(groupUuid, 'Must provide a turtleUuid')
    assert(turtleUuid, 'Must provide a turtleUuid')

    // Ensure the turtle exists
    await this.DatabaseService.getTurtle(groupUuid, turtleUuid)

    await this.DatabaseService.editTurtleAction(turtleUuid, null)
    const activeTurtles = await this.DatabaseService.getActiveTurtles(groupUuid)

    // If turtles are still working on the old job, we're telling the one requesting to wait
    if (activeTurtles.length) {
      if (activeTurtles[0].current_action === oldJobUuid) {
        return ''
      } else {
        return activeTurtles[0].current_action
      }
    }
    // If all turtles are waiting, start a new action
    const newActionUuid = await this.DatabaseService.startNewAction(groupUuid)
    await this.DatabaseService.editTurtleAction(turtleUuid, newActionUuid)

    return newActionUuid
  }

  /**
   * Add a block to a group's blacklist
   *
   * @param {String} groupUuid - The uuid of the group
   * @param {String} block - The name/metadata of the block to be blacklisted
   * @returns - Database entry
   */
  async addToBlacklist (groupUuid, block) {
    this.logger.trace('TurtleService.addToBlacklist')

    return this.DatabaseService.addToBlacklist(groupUuid, block)
  }

  /**
   * Get a group's blacklist
   *
   * @param {String} groupUuid - The uuid of the group
   * @returns - Array of blacklisted blocks
   */
  async getBlacklist (groupUuid) {
    this.logger.trace('TurtleService.getBlacklist')

    return this.DatabaseService.getBlacklist(groupUuid)
  }

  /**
   * Delete a block from a group's blacklist
   *
   * @param {Object} blacklistInfo - Info of the blacklist entry
   * @param {String} blacklistInfo.groupUuid - The uuid of the group
   * @param {String} blacklistInfo.blockUuid - The uuid of the block
   */
  async deleteFromBlacklist (blacklistInfo = {}) {
    this.logger.trace('TurtleService.deleteFromBlacklist')

    const { groupUuid, blockUuid } = blacklistInfo
    assert(groupUuid, 'Must provide a groupUuid')
    assert(blockUuid, 'Must provide a blockUuid')

    await this.DatabaseService.deleteFromBlacklist(groupUuid, blockUuid)
  }
}

module.exports = TurtleService
