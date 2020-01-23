module.exports = {
  services: {
    database: {
      user: 'postgres',
      password: 'postgres',
      host: 'orchestrator-postgres',
      port: 5432,
      database: 'orchestrator'
    },
    turtle: {
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
