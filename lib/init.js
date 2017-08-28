'use babel';

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions
import { CompositeDisposable } from 'atom';
import * as helpers from 'atom-linter';
import { dirname, relative } from 'path';

// Settings
let executablePath;
let additionalArguments;
let disableOnNoConfig;
let configName;
let disableTimeout;

export default {
  activate() {
    require('atom-package-deps').install('linter-scss-lint');

    this.subs = new CompositeDisposable();
    this.subs.add(
      atom.config.observe('linter-scss-lint.executablePath', (value) => {
        executablePath = value;
      }),
    );
    this.subs.add(
      atom.config.observe('linter-scss-lint.additionalArguments', (value) => {
        additionalArguments = value;
      }),
    );
    this.subs.add(
      atom.config.observe('linter-scss-lint.disableWhenNoConfigFileInPath', (value) => {
        disableOnNoConfig = value;
      }),
    );
    this.subs.add(
      atom.config.observe('linter-scss-lint.configName', (value) => {
        configName = value;
      }),
    );
    this.subs.add(
      atom.config.observe('linter-scss-lint.disableTimeout', (value) => {
        disableTimeout = value;
      }),
    );
  },

  deactivate() {
    this.subs.dispose();
  },

  getRelativeFilePath(filePath, configPath) {
    if (configPath) {
      return relative(dirname(configPath), filePath);
    }
    return filePath;
  },

  provideLinter() {
    return {
      name: 'scss-lint',
      grammarScopes: ['source.css.scss', 'source.scss'],
      scope: 'file',
      lintOnFly: true,
      lint: async (editor) => {
        const filePath = editor.getPath();
        const fileText = editor.getText();

        if (fileText.length === 0) {
          return [];
        }

        const config = await helpers.findAsync(filePath, configName);
        const relativeFilePath = this.getRelativeFilePath(filePath, config);

        if (disableOnNoConfig && !config) {
          return [];
        }

        const options = {
          cwd: dirname(filePath),
          stdin: fileText,
          ignoreExitCode: true,
        };
        if (disableTimeout) {
          options.timeout = Infinity;
        }

        const params = [
          `--stdin-file-path=${relativeFilePath}`,
          '--format=JSON',
          (config != null) ? `--config=${config}` : undefined,
          ...additionalArguments.split(' '),
        ].filter(e => e);

        const output = await helpers.exec(executablePath, params, options);

        if (editor.getText() !== fileText) {
          // Editor contents have changed, don't update messages
          return null;
        }

        let contents;
        try {
          contents = JSON.parse(output);
        } catch (error) {
          const regex1 = /^invalid option: --stdin-file-path=/; // <0.43.0
          const regex2 = /^undefined local variable or method `file'/; // 0.43.0, 0.43.1
          if (regex1.exec(output) || regex2.exec(output)) {
            atom.notifications.addError('You are using an old version of scss-lint', {
              detail: 'Please upgrade your version of scss-lint.\nCheck the README for further information.',
              dismissable: true,
            });
            // Tell Linter not to update the current messages (if any)
            return null;
          }
          // eslint-disable-next-line no-console
          console.error('[Linter-SCSS-Lint]', error, output);
          atom.notifications.addError('[Linter-SCSS-Lint]', {
            detail: 'SCSS-Lint returned an invalid response, check your console for more info.',
            dismissable: true,
          });
          // Tell Linter not to update the current messages (if any)
          return null;
        }

        return (contents[relativeFilePath] || []).map((msg) => {
          let badge;
          if (msg.linter) {
            badge = `<span class='badge badge-flexible scss-lint'>${msg.linter}</span> `;
          }

          // Atom expects ranges to be 0-based
          const line = (msg.line || 1) - 1;
          const col = (msg.column || 1) - 1;
          let range;

          if (msg.length) {
            // If the message defines a length, use that
            range = [[line, col], [line, col + msg.length]];
          } else {
            // Otherwise generate a range for the next "word" as defined by the language
            // NOTE: Current versions of scss-lint should _never_ hit this
            helpers.generateRange(editor, line, msg.column ? msg.column - 1 : undefined);
          }

          return {
            type: msg.severity || 'error',
            html: `${badge || ''}${msg.reason || 'Unknown Error'}`,
            filePath,
            range,
          };
        });
      },
    };
  },
};
