const fastify = require('fastify')
const Routes = require('./routes')

const App = function(options = {}) {
  const opt = {
    logger: options.logger,
    bodyLimit: 10048576
  }

  const server = fastify(opt)
  server.register(Routes.reports, {prefix: '/reports', options})
  server.register(Routes.welcome, {prefix: '/welcome', options})
  server.setNotFoundHandler((request, reply) => {
    let message  = 'no Route matched with those values'
    if ((request.headers.accept || '').match(/application\/json/i)) {
      message = { message }
    }
    reply
      .code(404)
      .send(message)
  })
  return server
}

module.exports = App
