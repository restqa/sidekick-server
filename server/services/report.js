const fs = require('fs')
const path = require('path')
const report = require('multiple-cucumber-html-reporter')
const os = require('os')

module.exports = function (folder) {
  function create (testSuite, rootExport=false) {
  
    // clean the information in the test suite 
    let features = testSuite.features.map((feature) => {
      delete feature.metadata
      feature.name = feature.feature_name
      return feature
    })
    
    const jsonDir = path.resolve(os.tmpdir(), testSuite.id)
    if (!fs.existsSync(jsonDir)) {
      fs.mkdirSync(jsonDir)
    }
    
    // store the testSuite into a file 
    let featureFileName = path.join(jsonDir, testSuite.id + '.json')
    fs.writeFileSync( featureFileName, JSON.stringify(features))
    
    let targetFolder = folder + '/' + testSuite.id
    if (true === rootExport) {
       targetFolder = folder
    }

    report.generate({
        jsonDir: jsonDir,
        reportPath: targetFolder,
        useCDN: true,
        displayDuration: true,
        durationInMS: true,
        customMetadata: true,
        pageTitle: testSuite.name + ' (' + testSuite.env + ')',
        reportName: testSuite.name + ' (' + testSuite.env + ')',
        pageFooter: '<div></div>',
        metadata: [
          { name: 'Environment', value: `${testSuite.env}` }
        ],
        customData: {
          title: testSuite.name,
          data: [
            {label: 'Execution id', value: testSuite.id},
            {label: 'Execution Start Time', value: testSuite.startTime},
            {label: 'Execution Environment', value: testSuite.env},
            {label: 'Repository', value: testSuite.repository},
            {label: 'Commit SHA', value: testSuite.sha},
          ]
        }
    })
    fs.unlinkSync(featureFileName)
  
    return testSuite.id
  }
  
  function get(id) {
    let filename = path.resolve(folder, id, 'index.html')
    if (!fs.existsSync(filename)) {
      let e = new Error(`The report "${id}" doesn't exist`)
      e.statusCode = 404
      throw e
    }
    return filename
  }
  
  function list () {
    let list = fs.readdirSync(folder) || []
    list = list
      .map(name => {
        let stat = fs.statSync(`${path.resolve(folder, name)}`)
        return {
          name,
          createdDate: new Date(stat.ctime)
        }
      })
      .sort((a, b) => b.createdDate.getTime() - a.createdDate.getTime())
    return list
  }

  return {
    create,
    get,
    list
  }
}
