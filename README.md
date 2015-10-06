linter-scss-lint
=========================
[![Build Status](https://travis-ci.org/AtomLinter/linter-scss-lint.svg?branch=master)](https://travis-ci.org/AtomLinter/linter-scss-lint)
[![Dependency Status](https://david-dm.org/AtomLinter/linter-scss-lint.svg)](https://david-dm.org/AtomLinter/linter-scss-lint)
[![Plugin installs!](https://img.shields.io/apm/dm/linter-scss-lint.svg)](https://atom.io/packages/linter-scss-lint)
[![Package version!](https://img.shields.io/apm/v/linter-scss-lint.svg?style=flat)](https://atom.io/packages/linter-scss-lint)

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [scss-lint](https://github.com/causes/scss-lint). It will be used with files that have the “SCSS” syntax.

### Installation
Linter package will automatically be installed for you if you do not already have it.

#### scss-lint installation
Before using this plugin, you must ensure that `scss-lint` is installed on your system. To install `scss-lint`, do the following:

1. Install [ruby](https://www.ruby-lang.org/).

2. Install [scss-lint](https://github.com/causes/scss-lint) by typing the following in a terminal:
   ```
   gem install scss_lint
   ```

Now you can proceed to install the linter-scss-lint plugin.

#### Plugin installation
```
$ apm install linter-scss-lint
```

### Settings
You can configure linter-scss-lint by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```cson
'linter-scss-lint':

  # Optionally specify additional arguments to be passed to `scss-lint`.
  # Run `scss-lint -h` to see available options.
  'additionalArguments': null

  # The `scss-lint` path. Run `which scss-lint` to find this path.
  'executablePath': null
```

### Config file
Linter will start looking for `.scss-lint.yml` file in the same directory as the file that's being linted. If not found, it will move one level up the directory tree all the way up to the filesystem root.


### Using `rvm`

If you are using `rvm`, you will need a wrapper for `scss-lint` to run properly.  There are a couple options for this (see below).

**_NOTE:_** *If you are seeing* `Error: env: ruby_executable_hooks: No such file or directory` *then you need to do this!*

Consult rvm docs for further info not covered in this README - https://rvm.io/

##### Wrapper just for atom

This will create a wrapper just for atom using your current ruby version:

```bash
$ rvm wrapper current atom scss_lint
```

Then in `linter-scss-lint` set `executablePath` to `/path/to/rvm/bin/atom_scss-lint`

*Note: you can find rvm path using* `which rvm`

##### Wrapper for ruby version

You can also just use the wrapper generated for a particular ruby version.  This may already be generated.  To check:

```bash
$ ls -al /path/to/rvm/gems/ruby-x.y.z/wrappers
```

If `scss-lint` isn't in there, generate the wrappers:

```bash
$ rvm wrapper current
```

Then in `linter-scss-lint` set `executablePath` to `/path/to/rvm/gems/ruby-x.y.z/wrappers/scss-lint`


### Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Please note that modifications should follow these coding guidelines:

- Indent is 2 spaces.
- Code should pass coffeelint linter.
- Vertical whitespace helps readability, don’t be afraid to use it.

Thank you for helping out!
