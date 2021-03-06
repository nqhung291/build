'use strict'

const { nextTick } = require('process')
const { promisify } = require('util')

// TODO: replace with `timers/promises` after dropping Node < 15.0.0
const pSetTimeout = promisify(setTimeout)

module.exports = {
  async onPreBuild({
    utils: {
      build: { failBuild },
    },
  }) {
    nextTick(() => {
      failBuild('test')
    })
    await pSetTimeout(0)
  },
}
