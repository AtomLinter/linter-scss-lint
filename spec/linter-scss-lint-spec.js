'use babel';

import {
  // eslint-disable-next-line no-unused-vars
  it, fit, wait, beforeEach, afterEach,
} from 'jasmine-fix';
import * as path from 'path';

const linter = require('../lib/init.js');

const badPath = path.join(__dirname, 'fixtures', 'bad.scss');
const configPath = path.join(__dirname, 'fixtures', '.scss-lint.yml');
const emptyPath = path.join(__dirname, 'fixtures', 'empty.scss');
const goodPath = path.join(__dirname, 'fixtures', 'good.scss');
const invalidPath = path.join(__dirname, 'fixtures', 'invalid.scss');

describe('The scss_lint provider for Linter', () => {
  const { lint } = linter.provideLinter();

  beforeEach(async () => {
    atom.workspace.destroyActivePaneItem();
    await atom.packages.activatePackage('linter-scss-lint');
    await atom.packages.activatePackage('language-sass');
    await atom.workspace.open(goodPath);
  });

  it('should be in the packages list', () => {
    expect(atom.packages.isPackageLoaded('linter-scss-lint')).toBe(true);
  });

  it('should be an active package', () => {
    expect(atom.packages.isPackageActive('linter-scss-lint')).toBe(true);
  });

  it('shows messages in a file with errors', async () => {
    const editor = await atom.workspace.open(badPath);
    const messages = await lint(editor);
    const messageHtml = 'Syntax: '
      + 'Syntax Error: Invalid CSS after "body {": expected "}", was ""';

    expect(messages[0].severity).toBe('error');
    expect(messages[0].excerpt).toBe(messageHtml);
    expect(messages[0].description).not.toBeDefined();
    expect(messages[0].location.file).toBe(badPath);
    expect(messages[0].location.position).toEqual([[1, 0], [1, 1]]);
  });

  it('shows messages in a file with warnings', async () => {
    const colorKeyword = 'ColorKeyword: '
      + 'Color `red` should be written in hexadecimal form as `#ff0000`';
    const colorVariable = 'ColorVariable: Color literals like `red` should only be used in '
      + 'variable declarations; they should be referred to via variable '
      + 'everywhere else.';
    const expected = new Map();
    expected.set(colorKeyword,
      {
        severity: 'warning',
        excerpt: colorKeyword,
        location: {
          file: invalidPath,
          position: [[1, 20], [1, 23]],
        },
      });
    expected.set(colorVariable,
      {
        severity: 'warning',
        excerpt: colorVariable,
        location: {
          file: invalidPath,
          position: [[1, 20], [1, 23]],
        },
      });

    const editor = await atom.workspace.open(invalidPath);
    const messages = await lint(editor);

    messages.forEach((message) => {
      if (!expected.has(message.excerpt)) {
        expect(true).toBe(false);
      }
      expect(message).toEqual(expected.get(message.excerpt));
    });
  });

  it('finds nothing wrong with an empty file', async () => {
    const editor = await atom.workspace.open(emptyPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  it('finds nothing wrong with a valid file', async () => {
    const editor = await atom.workspace.open(goodPath);
    const messages = await lint(editor);

    expect(messages.length).toBe(0);
  });

  describe('getRelativeFilePath', () => {
    it('returns relative file path if config file is found', () => {
      const relativePath = linter.getRelativeFilePath(goodPath, configPath);
      expect(relativePath).toBe('good.scss');
    });

    it('returns absolute file path if config file is not found', () => {
      const relativePath = linter.getRelativeFilePath(goodPath);
      expect(relativePath).toBe(goodPath);
    });
  });
});
