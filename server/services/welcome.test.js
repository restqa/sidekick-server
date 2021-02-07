const Welcome = require('./welcome')

describe('#Service - welcome', () => {
  describe('#get', () => {
    test('Return the content', ()=> {
      const expectedContent = require('../../data/welcome')
      expect(Welcome.get()).toEqual(expectedContent)
    })
  })
})
