/* eslint-disable no-useless-constructor */
const Service = require('../Service')
const { Client } = require('pg')
const uuid = require('uuid/v4')
const assert = require('assert')

class DatabaseService extends Service {
  /**
   * Initialize the service
   *
   * @param {Object} app - The application with all Services and Config
   */
  async _init (app) {
    await super._init(app)

    const { user, host } = this.config

    this.logger.info('📁', `Postgres connecting to ${user}@${host}`)
    this.client = new Client(this.config)
    await this.client.connect()
    this.logger.info('📁', `Postgres connected to ${user}@${host}`)

    this.setServiceReady()
  }

  /**
   * Create a turtle group
   */
  async createGroup () {
    this.logger.trace('DatabaseService.createGroup')

    const groupUuid = uuid()
    const actionUuid = uuid()
    try {
      const { rows: [result] } = await this.client.query('INSERT INTO public.group(uuid, current_action) VALUES($1, $2) RETURNING *', [groupUuid, actionUuid])
      return result.uuid
    } catch (err) {
      this.logger.error(`Error creating group ${groupUuid}: ${err.message || err}`)
      throw new Error(`Error creating group ${groupUuid}.`)
    }
  }

  /**
   * Create a turtle in a group
   *
   * @param {String} groupUuid - Group the turtle will belong to
   */
  async createTurtle (groupUuid) {
    this.logger.trace('DatabaseService.createTurtle')

    const turtleUuid = uuid()
    try {
      const { rows: [result] } = await this.client.query('INSERT INTO public.turtle(uuid, group_uuid) VALUES($1, $2) RETURNING *', [turtleUuid, groupUuid])
      return result.uuid
    } catch (err) {
      this.logger.error(`Error creating turtle ${turtleUuid} in group ${groupUuid}: ${err.message || err}`)
      throw new Error(`Error creating turtle ${turtleUuid} in group ${groupUuid}.`)
    }
  }

  /**
   * Edit the current_action of a turtle
   *
   * @param {String} turtleUuid - The uuid of the turtle
   * @param {String} actionUuid - The uuid of the action
   */
  async editTurtleAction (turtleUuid, actionUuid) {
    this.logger.trace('DatabaseService.editTurtleAction')

    try {
      const { rows } = await this.client.query('UPDATE public.turtle SET current_action = $1 WHERE uuid = $2 RETURNING *', [actionUuid, turtleUuid])
      assert(rows.length === 1, `Updated ${rows.length} rows.`)
      return actionUuid
    } catch (err) {
      this.logger.error(`Error editing turtle ${turtleUuid} action to ${actionUuid}: ${err.message || err}`)
      throw new Error(`Error editing turtle ${turtleUuid} action to ${actionUuid}.`)
    }
  }

  /**
   * Get all active turtles from a group
   *
   * @param {String} groupUuid - The uuid of the group of turtles
   */
  async getActiveTurtles (groupUuid) {
    this.logger.trace('DatabaseService.getActiveTurtles')

    try {
      const { rows } = await this.client.query('SELECT * FROM public.turtle WHERE group_uuid = $1 AND current_action IS NOT NULL', [groupUuid])
      return rows
    } catch (err) {
      this.logger.error(`Error getting active turtles for groupe ${groupUuid}: ${err.message || err}`)
      throw new Error(`Error getting active turtles for groupe ${groupUuid}.`)
    }
  }

  /**
   * Start a new action for a group
   *
   * @param {String} groupUuid - The uuid of the group of turtles
   */
  async startNewAction (groupUuid) {
    this.logger.trace('DatabaseService.startNewAction')

    const actionUuid = uuid()
    try {
      const { rows } = await this.client.query('UPDATE public.group SET current_action = $1 WHERE uuid = $2 RETURNING *', [actionUuid, groupUuid])
      assert(rows.length === 1, `Updated ${rows.length} rows.`)
      return actionUuid
    } catch (err) {
      this.logger.error(`Error starting new action ${actionUuid} for group ${groupUuid}: ${err.message || err}`)
      throw new Error(`Error starting new action ${actionUuid} for group ${groupUuid}.`)
    }
  }
}

module.exports = DatabaseService
