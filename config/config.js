module.exports = {
  services: {
    sso: {
      endpoint: '',
      apiKey: ''
    },
    database: {
      containerName: 'orchestrator-postgres',
      user: 'postgres',
      password: 'postgres',
      host: 'orchestrator-postgres',
      port: 5432,
      database: 'orchestrator'
    },
    turtle: {
      sso: {
        emailPrefix: 'computercraft-turtle-orchestrator-group',
        emailDomain: 'yourdomain.ltd',
        password: 'toto4242'
      }
    },
    server: {
      waitFor: ['DatabaseService', 'TurtleService'],
      routes: {
        createGroup: {
          http: 'post',
          path: '/group',
          controller: 'Turtle',
          method: 'createGroup'
        },
        createTurtle: {
          http: 'post',
          path: '/group/:groupUuid',
          controller: 'Turtle',
          method: 'createTurtle'
        },
        getNextAction: {
          http: 'get',
          path: '/group/:groupUuid/:turtleUuid/next',
          controller: 'Turtle',
          method: 'getNextAction'
        },
        getNextActionWithJob: {
          http: 'get',
          path: '/group/:groupUuid/:turtleUuid/next/:oldJobUuid',
          controller: 'Turtle',
          method: 'getNextAction'
        },
        addToBlacklist: {
          http: 'post',
          path: '/group/:groupUuid/blacklist',
          controller: 'Turtle',
          method: 'addToBlacklist'
        },
        deleteFromBlacklist: {
          http: 'delete',
          path: '/group/:groupUuid/blacklist/:blockUuid',
          controller: 'Turtle',
          method: 'deleteFromBlacklist'
        },
        getBlacklist: {
          http: 'get',
          path: '/group/:groupUuid/blacklist',
          controller: 'Turtle',
          method: 'getBlacklist'
        }
      },
      port: 4261,
      host: '0.0.0.0'
    }
  },
  controllers: {
    turtle: {
    }
  }
}
