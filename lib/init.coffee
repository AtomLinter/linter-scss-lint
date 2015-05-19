module.exports =
  config:
    executablePath:
      title: 'Scss-lint Executable Path'
      description: 'The path where scss-lint is located'
      type: 'string'
      default: ''
    excludedLinters:
      type: 'array'
      default: []
      items:
        type: 'string'

  activate: ->
    console.log 'activate linter-scss-lint'
