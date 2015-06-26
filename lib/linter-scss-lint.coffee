linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile} = require "#{linterPath}/lib/utils"
{Range} = require 'atom'

class LinterScssLint extends Linter
  @syntax: 'source.css.scss'

  linterName: 'scss-lint'

  cmd: 'scss-lint --format JSON'

  options: ['additionalArguments', 'executablePath']

  beforeSpawnProcess: (command, args, options) ->
    {
      command,
      args: args.slice(0, -1).concat(
        if config = findFile @cwd, '.scss-lint.yml' then ['-c', config] else []
        if @additionalArguments then @additionalArguments.split(' ') else []
        args.slice(-1)
      )
      options
    }

  processMessage: (message, cb) ->
    try
      files = JSON.parse(message) || {}
    catch
      return cb [@createMessage {reason: message}]

    cb(@createMessage lint for lint in files[Object.keys(files)[0]] || [])

  createMessage: (lint) ->
    {
      line: line = (lint.line || 1) - 1,
      col: col = (lint.column || 1) - 1,
      level: lint.severity || 'error',
      message: (lint.reason || 'Unknown Error') +
        (if lint.linter then " (#{lint.linter})" else ''),
      linter: @linterName,
      range: new Range([line, col], [line, col + (lint.length || 0)])
    }

module.exports = LinterScssLint
