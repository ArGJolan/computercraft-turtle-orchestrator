const { promisify } = require('util')
const exec = promisify(require('child_process').exec)
const config = require('../config')
const { logger, sleep } = require('../utils')

const {
  containerName: CONTAINER_NAME,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  port: POSTGRES_PORT,
  database: POSTGRES_DB
} = config.services.database

const POSTGRES_CONNECTION_STRING = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost/${POSTGRES_DB}`

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
    logger.warn(`⚠️ Could not stop container ${CONTAINER_NAME}`)
  }

  await sleep(5)

  try {
    await exec(`docker volume rm ${CONTAINER_NAME}-pgdata`)
  } catch (e) {
    logger.warn(`⚠️ Could not remove old volume ${CONTAINER_NAME}-pgdata`)
  }
  await exec(`docker volume create ${CONTAINER_NAME}-pgdata`)
  await exec(`
    docker run -d \
      --name ${CONTAINER_NAME} \
      -v ${CONTAINER_NAME}-pgdata:/var/lib/postgresql/data \
      -v "$PWD"/db/init-db.sql:/var/lib/postgresql/init-db.sql \
      -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD} \
      -e POSTGRES_USER=${POSTGRES_USER} \
      -e POSTGRES_DB=${POSTGRES_DB} \
      -p ${POSTGRES_PORT}:5432 \
      postgres:9.5
  `)

  await sleep(5)
  await exec(`docker exec ${CONTAINER_NAME} psql ${POSTGRES_CONNECTION_STRING} --file /var/lib/postgresql/init-db.sql`)

  // TODO: run init script

  logger.info('✅ postgres database reset')
}

start().catch(err => {
  logger.error('❌ Could not reset postgres database')
  logger.stack(err)
})
