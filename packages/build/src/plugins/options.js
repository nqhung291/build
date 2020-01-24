const { promisify } = require('util')

const resolve = require('resolve')

const { CORE_PLUGINS } = require('../plugins_core/main')
const { addDependency } = require('../utils/install')

const pResolve = promisify(resolve)

// Load plugin options (specified by user in `config.plugins`)
const getPluginsOptions = async function({ plugins: pluginsOptions }, baseDir) {
  const pluginsOptionsA = [...CORE_PLUGINS, ...pluginsOptions].map(normalizePluginOptions).filter(isPluginEnabled)
  const pluginsOptionsB = await Promise.all(pluginsOptionsA.map(pluginOptions => resolvePlugin(pluginOptions, baseDir)))
  return pluginsOptionsB
}

const normalizePluginOptions = function(pluginOptions) {
  const { id, package, core, enabled, config: pluginConfig } = {
    ...DEFAULT_PLUGIN_OPTIONS,
    ...pluginOptions,
  }
  return { id, package, core, enabled, pluginConfig }
}

const DEFAULT_PLUGIN_OPTIONS = { enabled: true, core: false, config: {} }

const isPluginEnabled = function({ enabled }) {
  return String(enabled) !== 'false'
}

// We use `resolve` because `require()` should be relative to `baseDir` not to
// this `__filename`
const resolvePlugin = async function({ package, ...pluginOptions }, baseDir) {
  try {
    return await tryResolvePlugin(package, pluginOptions, baseDir)
    // Try installing the dependency if it is missing.
    // This also solves Yarn Plug-and-Play, which does not work well with
    // `resolve`
  } catch (error) {
    try {
      await addDependency(package, { packageRoot: baseDir, stdio: 'ignore' })
      return await tryResolvePlugin(package, pluginOptions, baseDir)
    } catch (newError) {
      error.message = `'${package}' plugin not installed or found\n${error.message}\n${newError.message}`
      throw error
    }
  }
}

const tryResolvePlugin = async function(package, pluginOptions, baseDir) {
  const pluginPath = await pResolve(package, { basedir: baseDir })
  return { ...pluginOptions, package, pluginPath }
}

module.exports = { getPluginsOptions }
