const { removeFalsy } = require('./utils/remove_falsy')

// Some properties can be optionally capitalized. We normalize them to lowercase
const normalizeConfigCase = function({ Build, build = Build, ...config }) {
  const buildA = normalizeBuildCase(build)
  return { ...config, build: buildA }
}

const normalizeBuildCase = function({
  Base,
  base = Base,
  Command,
  command = Command,
  Edge_handlers: EdgeHandlers,
  edge_handlers = EdgeHandlers,
  Environment,
  environment = Environment,
  Functions,
  functions = Functions,
  Ignore,
  ignore = Ignore,
  Processing,
  processing = Processing,
  Publish,
  publish = Publish,
  ...build
} = {}) {
  return removeFalsy({ ...build, base, command, edge_handlers, environment, functions, ignore, processing, publish })
}

module.exports = { normalizeConfigCase, normalizeBuildCase }
