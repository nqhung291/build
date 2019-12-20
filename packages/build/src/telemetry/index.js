const Analytics = require('analytics').default

const pkg = require('../../package.json')

const plugins = require('./plugins')

/* If DEBUG true, disable telemetry api calls */
const DEBUG_ENABLED = false

const telemetry = Analytics({
  app: 'netlifyCI',
  debug: DEBUG_ENABLED,
  version: pkg.version,
  plugins: plugins,
})

// Send telemetry request when build completes
const trackBuildComplete = async function({ commandsCount, netlifyConfig, duration, flags }) {
  const payload = getPayload({ commandsCount, netlifyConfig, duration, flags })
  await telemetry.track('buildComplete', payload)
}

const getPayload = function({ commandsCount, netlifyConfig, duration, flags: { siteId } }) {
  const plugins = Object.values(netlifyConfig.plugins).map(getPluginType)
  return { steps: commandsCount, duration, pluginCount: plugins.length, plugins, siteId }
}

const getPluginType = function({ type }) {
  return type
}

module.exports = { trackBuildComplete }
