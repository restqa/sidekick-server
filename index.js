const Server = require('./server')

const {
  PORT = 8080,
  EXPORT_FOLDER
} = process.env

const options = {
  exportFolder: EXPORT_FOLDER ||  __dirname + '/reports/', 
  logger: true
}

const server = Server(options)
server.listen(PORT, '0.0.0.0', (err, address) => {
  if (err) {
    server.log.error(err)
    process.exit(1)
  }
  server.log.info('Server running on the port', PORT)
})
