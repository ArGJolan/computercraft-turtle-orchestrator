const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const config = require('../config')
const { logger, sleep } = require('../utils')

const {
  containerName: CONTAINER_NAME,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  host: POSTGRES_HOST,
  port: POSTGRES_PORT,
  database: POSTGRES_DB
} = config.services.database

const start = async () => {
  try {
    await exec('command -v docker')
  } catch (e) {
    logger.error('Docker is not installed. Please install docker to use this script.')
    process.exit(1)
  }
  try {
    await exec(`docker rm -f ${CONTAINER_NAME}`)
  } catch (e) {
    logger.warn(`⚠️ Could not stop container ${CONTAINER_NAME}: ${e.message || e}`)
  }
  await exec(`docker volume create ${CONTAINER_NAME}-pgdata`)
  await exec(`
    docker run -d \
      --name ${CONTAINER_NAME} \
      -v ${CONTAINER_NAME}-pgdata:/var/lib/postgresql/data \
      -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
      -e POSTGRES_USER=${POSTGRES_USER} \
      -e POSTGRES_DB=${POSTGRES_DB} \
      -p ${POSTGRES_PORT}:5432 \
      postgres:9.5
  `)

  await sleep(5)

  let status
  try {
    const { stdout } = await exec(`docker inspect ${CONTAINER_NAME}`)
    status = JSON.parse(stdout)[0].State.Status
  } catch (e) {
    logger.warn('⚠️ Could not get postgres status, it may not be started.')
    return logger.stack(e)
  }
  if (status !== 'running') {
    throw new Error(`Container status is ${status}`)
  }
  if (!['localhost', '127.0.0.1', '0.0.0.0'].includes(POSTGRES_HOST)) {
    logger.warn(`⚠️ Your configuration file is set to host ${POSTGRES_HOST}, you may want to fix that.`)
  }
  logger.info(`✅ Postgres running at postgres://localhost:${POSTGRES_PORT}`)
}

start().catch(err => {
  logger.error('❌ Could not start postgres')
  logger.stack(err)
})
