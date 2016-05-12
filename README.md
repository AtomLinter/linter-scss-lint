# linter-scss-lint

[![build-status-image]][travis-ci]
[![dependency-status-image]][david-dm]
[![package-downloads-image]][atom-package]
[![package-version-image]][atom-package]

This linter plugin for [Linter] provides an interface to [scss-lint]. It will be
used with files that have the "SCSS" syntax.

## Installation

The [Linter] package will be installed for you to provide an interface to this
package. If you are using an alternative linter-* consumer feel free to disable
the linter package.

### `scss-lint` installation

Before using this plugin, you must ensure that `scss-lint` is installed on your
system. To install `scss-lint`, do the following:

1.  Install [Ruby].

2.  Install [scss-lint] by typing the following in a terminal:

    ```shell
    gem install scss_lint
    ```

    **IMPORTANT**: This plugin requires at least v0.43.2 of [scss-lint].

Now you can proceed to install the linter-scss-lint plugin.

### Plugin installation

To install this plugin either search for it from within Atom's settings menu
or run the following command:

```shell
apm install linter-scss-lint
```

## Settings

You can configure linter-scss-lint from within Atom's settings menu, or by
editing `~/.atom/config.cson` file (choose Open Your Config in Atom's menu).

The following settings are available:

-   `additionalArguments`: Optionally specify additional arguments to be passed
    to `scss-lint`. For a full list of the arguments, and their description see
    [the documentation][scss-lint-usage-docs].

-   `disableWhenNoConfigFileInPath`: Disable linter when no `.scss-lint.yml` is
    found in project.

-   `executablePath`: Defaults to `scss-lint`, allowing the `$PATH` to resolve
    the correct location. If you need to override this specify the full path to
    `scss-lint`.

    You can find the full path to `scss-lint` by running `which scss-lint` (or
    if you're using [rbenv]: `rbenv which scss-lint`).

**Note**: This plugin finds the nearest `.scss-lint.yml` file and will
automatically use it if it exists. If it does not, `scss-lint` will run with its
default settings.

## Using a version manager?

### Using [rbenv]

If you're using [rbenv], you will need to make sure your `$PATH` is set
correctly for Atom. From version 1.7 onwards, Atom provides a normalized
environment so that the correct `$PATH` is available no matter how Atom was
launched.

If you're running an Atom version that's prior to 1.7, then you can patch the
environment inside `~/.atom/init.coffee`. Add the following line (thanks to
[ruby-bundler]):

```coffee
process.env.PATH = "#{process.env.HOME}/.rbenv/shims:#{process.env.HOME}/.rbenv/bin:#{process.env.PATH}"
```

### Using [RVM]

If you're using [RVM] and receiving errors in Atom that indicate `scss-lint`
can't be found, you may need to change `/bin` to `/wrappers` in the path that
gets returned from `which scss-lint` before using it as your `executablePath`
setting. For example, change:

```text
/path/to/rvm/gems/ruby-x.y.z/bin/scss-lint
```

To:

```text
/path/to/rvm/gems/ruby-x.y.z/wrappers/scss-lint
```

**Note**: You can find the path to your [RVM] installation using `which rvm`.

#### Create a scoped wrapper for Atom

You could also create a scoped wrapper by running the following command:

```shell
rvm wrapper current atom scss-lint
```

Now you need to set the `executablePath` setting to that of the newly generated
wrapper.

[atom-package]: https://atom.io/packages/linter-scss-lint
[david-dm]: https://david-dm.org/AtomLinter/linter-scss-lint
[linter]: https://github.com/AtomLinter/linter "Linter"
[rbenv]: https://github/rbenv/rbenv "rbenv"
[ruby]: https://www.ruby-lang.org "Ruby"
[ruby-bundler]: https://github.com/willcosgrove/atom-ruby-bundler
[rvm]: https://rvm.io "RVM"
[scss-lint]: https://github.com/brigade/scss-lint "scss-lint"
[scss-lint-usage-docs]: https://github.com/brigade/scss-lint#usage
[travis-ci]: https://travis-ci.org/AtomLinter/linter-scss-lint

[build-status-image]: https://img.shields.io/travis/AtomLinter/linter-scss-lint/master.svg
[dependency-status-image]: https://img.shields.io/david/AtomLinter/linter-scss-lint.svg
[package-downloads-image]: https://img.shields.io/apm/dm/linter-scss-lint.svg
[package-version-image]: https://img.shields.io/apm/v/linter-scss-lint.svg
