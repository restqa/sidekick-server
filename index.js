const Server = require('./server')

const {
  PORT = 8080,
  EXPORT_FOLDER
} = process.env

const options = {
  exportFolder: EXPORT_FOLDER ||  __dirname + '/reports/', 
}

Server(options)
  .listen(PORT, '0.0.0.0', (err, address) => {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
  })
