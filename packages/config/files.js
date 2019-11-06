const { resolve } = require('path')

const { get, set } = require('dot-prop')

const handleFiles = function(config, baseDir) {
  return PATHS.reduce(normalizePath.bind(null, baseDir), config)
}

// Resolve paths relatively to the config file.
// Also normalize paths to OS-specific path delimiters.
const normalizePath = function(baseDir, config, path) {
  const value = get(config, path)

  if (typeof value !== 'string') {
    return config
  }

  return set(config, path, resolve(baseDir, value))
}

const PATHS = ['build.publish', 'build.functions']

module.exports = { handleFiles }
