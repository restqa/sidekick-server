const  { Welcome } = require('../services')

module.exports = function(server, opts, next) {
  const { options } = opts
  server.get('*', (request, reply) => {
    reply
      .code(200)
      .send(Welcome.get())
  })
  next()
}

