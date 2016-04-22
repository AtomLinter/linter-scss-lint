{CompositeDisposable} = require 'atom'
{find, exec} = helpers = require 'atom-linter'
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

  getRelativeFilePath: (filePath, configPath) ->
    if configPath
      path.relative(path.dirname(configPath), filePath)
    else
      filePath

  provideLinter: ->
    provider =
      name: 'scss-lint'
      grammarScopes: ['source.css.scss', 'source.scss']
      scope: 'file'
      lintOnFly: yes
      lint: (editor) =>
        filePath = editor.getPath()
        fileText = editor.getText()

        return Promise.resolve([]) if fileText.length is 0

        config = find filePath, '.scss-lint.yml'
        relativeFilePath = @getRelativeFilePath(filePath, config)

        return Promise.resolve([]) if @disableOnNoConfig and not config

        cwd = path.dirname(filePath)
        params = [
          "--stdin-file-path=#{relativeFilePath}",
          '--format=JSON',
          if config? then "--config=#{config}",
          @additionalArguments.split(' ')...
        ].filter((e) -> e)

        return helpers.exec(@executablePath, params, {stdin: fileText, cwd})
          .then (output) ->
            try
              return JSON.parse(output)
            catch error
              regex = /^invalid option: --stdin-file-path\=/g
              if regex.exec(output)
                atom.notifications.addError('You are using an old version of scss-lint', {
                  detail: 'Please upgrade your version of scss-lint.\nCheck the README for further information.',
                  dismissable: true
                })
                return {}
              else
                console.error('[Linter-SCSS-Lint]', error, output)
                atom.notifications.addError('[Linter-SCSS-Lint]', {
                  detail: 'SCSS-Lint returned an invalid response, check your console for more info',
                  dismissable: true
                })
                return {}
          .then (contents) ->
            return [] unless contents[relativeFilePath]
            return contents[relativeFilePath].map (msg) ->
              badge = "<span class='badge badge-flexible scss-lint'>#{msg.linter}</span> " if msg.linter

              # Atom expects ranges to be 0-based
              line = (msg.line or 1) - 1
              col = (msg.column or 1) - 1

              type: msg.severity or 'error',
              html: "#{badge or ''}#{msg.reason or 'Unknown Error'}",
              filePath: filePath,
              range: [[line, col], [line, col + (msg.length or 0)]]
