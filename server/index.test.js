const Server = require('./index')
const fs = require('fs')
const path = require('path')
const os = require('os')
const rimraf = require("rimraf")

describe('#Server - index', () => {

  test('return 404 with json message if the route doesni\'t exits and accept content is application/json ', async () => {

    const app = Server()

    const response = await app.inject({
      method: 'GET',
      url: '/my-route',
      headers: {
        'accept': 'Application/json'
      }
    })
    expect(response.statusCode).toBe(404) 
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8') 
    expect(response.body).toEqual(JSON.stringify({"message":"no Route matched with those values"}))
  })

  test('return 404 with text message if the route doesn\'t exits and accept content is text/html', async () => {

    const app = Server()

    const response = await app.inject({
      method: 'GET',
      url: '/my-route',
      headers: {
        'accept': 'text/html'
      }
    })
    expect(response.statusCode).toBe(404) 
    expect(response.headers['content-type']).toBe('text/plain; charset=utf-8') 
    expect(response.body).toEqual('no Route matched with those values')
  })

  test('Return The welcome response body', async () => {

    const app = Server()
    const response = await app.inject({
      method: 'GET',
      url: '/welcome',
      headers: {
        'accept': 'application/json'
      }
    })
    expect(response.statusCode).toBe(200) 
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8') 
    const welcomeObj = require('../data/welcome.json')
    expect(response.body).toEqual(JSON.stringify(welcomeObj))

  })

  test('Return an empty list of if no file exists (json)', async () => {

    let folder = path.resolve(process.cwd(), 'features-for-tests')
    fs.mkdirSync(folder)

    
    const options = {
      exportFolder: folder
    }
    const app = Server(options)

    const response = await app.inject({
      method: 'GET',
      url: '/reports',
      headers: {
        'accept': 'application/json'
      }
    })
    expect(response.statusCode).toBe(200) 
    expect(response.headers['content-type']).toBe('application/json; charset=utf-8') 
    expect(JSON.parse(response.body)).toEqual([])
    rimraf.sync(folder)
  })
})

