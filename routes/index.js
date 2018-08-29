
const homeRouter = require('./home')
const usersRouter = require('./users')
const errorRouter = require('./error')



function routerConfig (app) {
  app.use("/",homeRouter)
  app.use("/users",usersRouter)
  app.use("/error",errorRouter)

}

module.exports = routerConfig;
