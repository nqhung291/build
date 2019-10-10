const { cwd } = require('process')

const execa = require('execa')
const mkdirp = require('mkdirp')

module.exports = {
  async init() {
    mkdirp.sync(`.axe-results/`)
    await execa('chmod', ['-R', '+rw', `.axe-results`])
  },
  async postDeploy({ pluginConfig: { site = process.env.SITE, axeFlags } }) {
    await execa(`axe ${site} ${axeFlags} --save .axe-results/result.json`, {
      stdio: 'inherit',
      preferLocal: true
    })

    let results = require(`${cwd()}/.axe-results/result.json`)
    if (results && results[0]) {
      results = results[0].violations
    }
    console.log({ violations: results })
  }
}
