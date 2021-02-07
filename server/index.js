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


/*
express()
  .disable('x-powered-by')
  .set('trust proxy', true)
  .use(express.json({limit:'50mb'}))
  .use(express.static($.config.exportFolder))
  .get('/latest', (req, res) => {
    let item = Report.list()[0]
    res.redirect(`./${item.name}`)
  })
  .get('/', (req, res) => {
    let result = Report.list().map(item => {
      return `<a href="./${item.name}/" target="blank">${item.name}</a> - ${item.createdDate}<br/>`
    })

    res
      .set('application/html')
      .send(result.join(''))
  })
  .post('/', (req, res) => {
    let id = Report.create(req.body)
    res
      .status(201)
      .json({
        url: `${req.protocol}://${req.get('host')}/${id}`
      })
  })
  .use((err, req,res, next) => res.send(err.statusCode || 500, err.message))
  .listen($.config.port, () => {
    console.log(`Server started on the port: ${$.config.port}`)
  })
  */
