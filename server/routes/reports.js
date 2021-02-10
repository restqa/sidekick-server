const  { Report } = require('../services')

module.exports = function(server, opts, next) {
  const { options } = opts
  const report = Report(options.exportFolder)

  server.register(require('fastify-static'), {
    root: options.exportFolder
  })

  server.get('/', (request, reply) => {
    reply
      .code(200)
      .send(report.list())
  })

  server.get('/:id', (request, reply) => {
    reply.sendFile(`${request.params.id}/index.html`)
  })

  server.post('/', (request, reply) => {
    const { body } = request
    let id = report.create(body)
    reply
      .code(201)
      .send({
        url: `${request.protocol}://${request.hostname}/${id}`
      })
  })

  next()
}
