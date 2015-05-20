linter-scss-lint
=========================
[![Gitter](https://img.shields.io/badge/gitter-join%20chat-1dce73.svg?style=flat)](https://gitter.im/AtomLinter/Linter?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Plugin installs!](https://img.shields.io/apm/dm/linter-scss-lint.svg)](https://atom.io/packages/linter-scss-lint)
[![Package version!](https://img.shields.io/apm/v/linter-scss-lint.svg?style=flat)](https://atom.io/packages/linter-scss-lint)
[![Dependencies!](https://david-dm.org/AtomLinter/Linter.svg)](https://david-dm.org/AtomLinter/linter-scss-lint)

[![Gratipay donate button](https://img.shields.io/gratipay/hd-deman.svg?style=flat)](https://www.gratipay.com/hd-deman/ "Donate weekly to this project using Gratipay")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg?style=flat)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg?style=flat)](https://www.coinbase.com/checkouts/2945dab392cb1cefbb7097e4cd17a603 "Donate once-off to this project using BitCoin")

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to [scss-lint](https://github.com/causes/scss-lint). It will be used with files that have the “SCSS” syntax.

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### scss-lint installation
Before using this plugin, you must ensure that `scss-lint` is installed on your system. To install `scss-lint`, do the following:

1. Install [ruby](https://www.ruby-lang.org/).

2. Install [scss-lint](https://github.com/causes/scss-lint) by typing the following in a terminal:
   ```
   gem install scss-lint
   ```

Now you can proceed to install the linter-scss-lint plugin.

### Plugin installationd
```
$ apm install linter-scss-lint
```

## Settings
You can configure linter-scss-lint by editing ~/.atom/config.cson (choose Open Your Config in Atom menu):
```
'linter-scss-lint':
  'executablePath': null #scss-lint path. run 'which scss-lint' to find the path
  'excludedLinters': [] # a list of linters to exclude from running. run 'scss-lint --show-linters' to see a list of linters that can be excluded.
```

## Config file
Linter will start looking for `.scss-lint.yml` file in the same directory as the file that's being linted. If not found, it will move one level up the directory tree all the way up to the filesystem root.


## Contributing
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


## Donation

[![Share the love!](https://s3-eu-west-1.amazonaws.com/atom-linter/we-need-your-help.png?style=flat)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8 "Share the love")

[![Gratipay donate button](https://img.shields.io/gratipay/hd-deman.svg?style=flat)](https://www.gratipay.com/hd-deman/ "Donate weekly to this project using Gratipay")
[![PayPayl donate button](https://img.shields.io/badge/paypal-donate-yellow.svg?style=flat)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KXUYS4ARNHCN8 "Donate once-off to this project using Paypal")
[![BitCoin donate button](https://img.shields.io/badge/bitcoin-donate-yellow.svg?style=flat)](https://www.coinbase.com/checkouts/2945dab392cb1cefbb7097e4cd17a603 "Donate once-off to this project using BitCoin")
