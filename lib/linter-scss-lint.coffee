linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"

class LinterScssLint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: 'source.css.scss'

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: 'scss-lint --format=XML'

  executablePath: null

  linterName: 'scss-lint'

  # A regex pattern used to extract information from the executable's output.
  regex: 'line="(?<line>\\d+)" column="(?<col>\\d+)" .*? severity="((?<error>error)|(?<warning>warning))" reason="(?<message>.*?)"'

  constructor: (editor)->
    super(editor)

    atom.config.observe 'linter-scss-lint.scssLintExecutablePath', =>
      @executablePath = atom.config.get 'linter-scss-lint.scssLintExecutablePath'

    atom.config.observe 'linter-scss-lint.scssLintExcludedLinters', =>
      @updateCommand()

  destroy: ->
    atom.config.unobserve 'linter-scss-lint.scssLintExecutablePath'
    atom.config.unobserve 'linter-scss-lint.scssLintExcludedLinters'

  updateCommand: ->
    excludedLinters = atom.config.get 'linter-scss-lint.scssLintExcludedLinters'

    if excludedLinters and excludedLinters.length > 0
      @cmd = "scss-lint --format=XML --exclude-linter=#{excludedLinters.toString()}"
    else
      @cmd = 'scss-lint --format=XML'

module.exports = LinterScssLint
