linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
findFile = require "#{linterPath}/lib/util"


class LinterScssLint extends Linter
  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: 'source.css.scss'

  linterName: 'scss-lint'

  options: ['excludedLinters', 'executablePath']

  # A regex pattern used to extract information from the executable's output.
  regex: 'line="(?<line>\\d+)" column="(?<col>\\d+)" .*? severity="((?<error>error)|(?<warning>warning))" reason="(?<message>.*?)"'

  updateOption: (option) =>
    super(option)

    # build cmd
    @cmd = 'scss-lint --format=XML'
    @cmd += " --exclude-linter=#{@excludedLinters.toString()}" if @excludedLinters and @excludedLinters.length > 0

    config = findFile @cwd, ['.scss-lint.yml']
    if config
      @cmd += " -c #{config}"

  formatMessage: (match) ->
    map = {
      quot: '"'
      amp: '&'
      lt: '<'
      gt: '>'
    }

    message = match.message
    for key,value of map
      regex = new RegExp '&' + key + ';', 'g'
      message = message.replace(regex, value)

    return message

module.exports = LinterScssLint
