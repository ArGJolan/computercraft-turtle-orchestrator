module.exports = {
  services: {
    sso: {
      endpoint: 'http://localhost:4247',
      apiKey: 'toto4242'
    },
    database: {
      containerName: 'orchestrator-postgres',
      user: 'postgres',
      password: 'postgres',
      host: 'localhost',
      port: 5432,
      database: 'orchestrator'
    }
  }
}
