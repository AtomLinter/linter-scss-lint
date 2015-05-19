module.exports =
  config:
    executablePath:
      title: 'Scss-lint Executable Path'
      description: 'The path where scss-lint is located.'
      type: 'string'
      default: ''
    excludedLinters:
      description: 'A list of linters to exclude from running. run `scss-lint --show-linters` to see a list of linters that can be excluded.'
      type: 'array'
      default: []
      items:
        type: 'string'

  activate: ->
    console.log 'activate linter-scss-lint'
