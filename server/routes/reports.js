const  { Report } = require('../services')

module.exports = function(server, opts, next) {
  const { options } = opts
  const report = Report(options.exportFolder)
  server.get('/', (request, reply) => {
    reply
      .code(200)
      .send(report.list())
  })
  next()
}
