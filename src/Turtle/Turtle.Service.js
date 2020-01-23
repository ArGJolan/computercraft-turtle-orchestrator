/* eslint-disable no-useless-constructor */
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

    return this.DatabaseService.createGroup()
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

    assert(groupUuid, 'Must provide an turtleUuid')
    assert(turtleUuid, 'Must provide an turtleUuid')

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
}

module.exports = TurtleService
