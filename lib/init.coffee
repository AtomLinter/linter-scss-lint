{BufferedProcess, CompositeDisposable} = require 'atom'
linterPath = atom.packages.resolvePackagePath("linter")
{findFile} = require "#{linterPath}/lib/utils"
path = require 'path'

module.exports =
  config:
    additionalArguments:
      title: 'Additional Arguments'
      type: 'string'
      default: ''
    executablePath:
      title: 'Executable Path'
      type: 'string'
      default: ''

  activate: ->
    console.log 'activate linter-scss-lint'
    @subs = new CompositeDisposable
    @subs.add atom.config.observe 'linter-scss-lint.executablePath',
      (executablePath) =>
        @executablePath = executablePath
    @subs.add atom.config.observe 'linter-scss-lint.additionalArguments',
      (additionalArguments) =>
        @additionalArguments = additionalArguments
  deactivate: ->
    @subs.dispose()
  provideLinter: ->
    provider =
      grammarScopes: ['source.css.scss']
      scope: 'file'
      lintOnFly: false
      lint: (editor) =>
        helpers = require "atom-linter"
        filePath = editor.getPath()
        config = findFile path.dirname(filePath), '.scss-lint.yml'
        params = [
          filePath,
          "--format=JSON",
          if config? then "--config=#{config}",
          @additionalArguments.split(' ')...
        ].filter((e) -> e)
        return helpers.exec(@executablePath, params).then (stdout) =>
          lint = try JSON.parse stdout
          unless lint?
            atom.notifications.addError "Error running #{@executablePath}",
            detail: "#{stdout}"
            return []
          if lint[filePath]?
            return lint[filePath].map (msg) ->
              line = (msg.line || 1) - 1
              col = (msg.column || 1) - 1

              type: msg.severity || 'error',
              text: (msg.reason || 'Unknown Error') +
                (if msg.linter then " (#{msg.linter})" else ''),
              filePath: filePath,
              range: [[line, col], [line, col + (msg.length || 0)]]
          else return []
        .catch (error) =>
          atom.notifications.addError "Error running #{@executablePath}",
            detail: "#{error.message}"
