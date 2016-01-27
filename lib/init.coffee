{CompositeDisposable} = require 'atom'
{find, exec, tempFile} = helpers = require 'atom-linter'
path = require 'path'

module.exports =
  config:
    additionalArguments:
      title: 'Additional Arguments'
      type: 'string'
      default: ''
    disableWhenNoConfigFileInPath:
      type: 'boolean'
      default: false
      description: 'Disable linter when no `.scss-lint.yml` is found in project'
    executablePath:
      title: 'Executable Path'
      type: 'string'
      default: 'scss-lint'

  activate: ->
    require('atom-package-deps').install()
    @subs = new CompositeDisposable
    @subs.add atom.config.observe 'linter-scss-lint.executablePath',
      (executablePath) =>
        @executablePath = executablePath
    @subs.add atom.config.observe 'linter-scss-lint.additionalArguments',
      (additionalArguments) =>
        @additionalArguments = additionalArguments
    @subs.add atom.config.observe 'linter-scss-lint.disableWhenNoConfigFileInPath',
      (disableOnNoConfig) =>
        @disableOnNoConfig = disableOnNoConfig

  deactivate: ->
    @subs.dispose()

  provideLinter: ->
    provider =
      name: 'scss-lint'
      grammarScopes: ['source.css.scss', 'source.scss']
      scope: 'file'
      lintOnFly: yes
      lint: (editor) =>
        filePath = editor.getPath()
        cwd = path.dirname(filePath)

        config = find cwd, '.scss-lint.yml'

        return [] if @disableOnNoConfig and not config

        tempFile path.basename(filePath), editor.getText(), (tmpFilePath) =>
          params = [
            tmpFilePath,
            '--format=JSON',
            if config? then "--config=#{config}",
            @additionalArguments.split(' ')...
          ].filter((e) -> e)
          return helpers.exec(@executablePath, params, {cwd}).then (stdout) ->
            lint = try JSON.parse stdout
            throw new TypeError(stdout) unless lint?
            return [] unless lint[tmpFilePath]
            return lint[tmpFilePath].map (msg) ->
              line = (msg.line or 1) - 1
              col = (msg.column or 1) - 1

              type: msg.severity or 'error',
              text: (msg.reason or 'Unknown Error') +
                (if msg.linter then " (#{msg.linter})" else ''),
              filePath: filePath,
              range: [[line, col], [line, col + (msg.length or 0)]]
