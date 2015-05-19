module.exports =
  config:
    scssLintExecutablePath:
      type: 'string'
      default: ''
    scssLintExcludedLinters:
      type: 'array'
      default: []
      items:
        type: 'string'

  activate: ->
    console.log 'activate linter-scss-lint'
