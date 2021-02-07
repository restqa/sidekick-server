const Report = require('./report')
const rimraf = require("rimraf")
const fs = require('fs')
const path = require('path')
const os = require('os')
const { utimes } = require('utimes')


let files = []
let folder = path.resolve(process.cwd(), 'features-for-tests')

beforeEach(() => {
  jest.resetModules()
  if (fs.existsSync(folder)){
    rimraf.sync(folder)
  }

  if (!fs.existsSync(folder)){
    fs.mkdirSync(folder)
  }
})

afterEach(() => {
  if (fs.existsSync(folder)){
    rimraf.sync(folder)
  }
  folder = path.resolve(process.cwd(), 'features-for-tests')
})

describe('#Services - report', () => {

  describe('#list', () => {
    test('Get the empty list of feature', async () => {
      const result = Report(folder).list()
      expect(result).toEqual([])
    })
  
    test('Get the list of files', async () => {
      folder = path.resolve(os.tmpdir(), 'features-for-tests')
      fs.mkdirSync(folder)

      fs.writeFileSync(folder + '/tmp1.txt', 'test content')
      fs.writeFileSync(folder + '/tmp2.txt', 'test content')
      
      utimes(folder + '/tmp1.txt', 447775200000) // 1984-03-10T14:00:00.000Z

      let result = Report(folder).list()
      const expectedResult = [{
        name: 'tmp2.txt'
      }, {
        name: 'tmp1.txt'
      }]
      result = result.map(_ => ({ name: _.name }))
      expect(result).toEqual(expectedResult)
    })
  })

  describe('#get', () => {
    test('Throw an error if the folder doesnt exist', () => {
      const id = 'yyy-xxx-zzz'
      expect(() => Report(folder).get(id)).toThrow('The report "yyy-xxx-zzz" doesn\'t exist')
    })

    test('Return the filename when it exists', () => {
      const id = 'yyy-xxx-zzz'
      files.push(path.resolve(folder, id, 'index.html'))
      fs.mkdirSync(path.dirname(files[0]))
      fs.writeFileSync(files[0], 'my content')
      const result = Report(folder).get(id)
      expect(result).toBe(files[0])
    })
  })

  describe('#create', () => {
    test('Generate the test report', () => {
      const id = 'yyy-xxx-zzz-' + Date.now()
      const testSuite = {
        id,
        name: 'my test suite',
        startTime: '2020-01-12',
        env: 'uat',
        repository: 'restqa/restqa',
        sha: 'my-sha',
        metadata: {
          name: 'my feature'
        },
        features: [{
          foo: 'bar'
        }]
      }
      const mockGenerateReporter = jest.fn()
      jest.mock('multiple-cucumber-html-reporter', () => {
        return { 
          generate: mockGenerateReporter
        }
      })
      const _Report = require('./report')
      const result = _Report(folder).create(testSuite)
      expect(mockGenerateReporter.mock.calls.length).toBe(1)
      const expectedOptions = {
        jsonDir: path.resolve(os.tmpdir(), id),
        reportPath: folder + '/' + id,
        useCDN: true,
        displayDuration: true,
        durationInMS: true,
        customMetadata: true,
        pageTitle: 'my test suite (uat)',
        reportName: 'my test suite (uat)',
        pageFooter: '<div></div>',
        metadata: [
          { name: 'Environment', value: 'uat' }
        ],
        customData: {
          title: testSuite.name,
          data: [
            {label: 'Execution id', value: id},
            {label: 'Execution Start Time', value: '2020-01-12'},
            {label: 'Execution Environment', value: 'uat'},
            {label: 'Repository', value: 'restqa/restqa'},
            {label: 'Commit SHA', value: 'my-sha'},
          ]
        }
      }
      expect(mockGenerateReporter.mock.calls[0][0]).toEqual(expectedOptions)
      expect(result).toBe(id)
      expect(fs.existsSync(folder + '/' + id)).toBe(false)
    })
  })
})

