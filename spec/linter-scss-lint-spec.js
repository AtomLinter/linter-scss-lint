'use babel';

import * as path from 'path';

const linter = require(path.join('..', 'lib', 'init'));

const badPath = path.join(__dirname, 'fixtures', 'bad.scss');
const configPath = path.join(__dirname, 'fixtures', '.scss-lint.yml');
const emptyPath = path.join(__dirname, 'fixtures', 'empty.scss');
const goodPath = path.join(__dirname, 'fixtures', 'good.scss');
const invalidPath = path.join(__dirname, 'fixtures', 'invalid.scss');

describe('The scss_lint provider for Linter', () => {
  const lint = linter.provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-scss-lint');
      return atom.packages.activatePackage('language-sass').then(() =>
        atom.workspace.open(goodPath)
      );
    });
  });

  it('should be in the packages list', () =>
    expect(atom.packages.isPackageLoaded('linter-scss-lint')).toEqual(true)
  );

  it('should be an active package', () =>
    expect(atom.packages.isPackageActive('linter-scss-lint')).toEqual(true)
  );

  describe('shows errors in a file with errors', () => {
    let editor = null;

    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badPath).then(openEditor => { editor = openEditor; })
      );
    });

    it('verifies the first message', () => {
      const messageHtml = 'Syntax Error: Invalid CSS after "body {": expected "}", was ""';

      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('error');
          expect(messages[0].html).toBeDefined();
          expect(messages[0].html).toEqual(messageHtml);
          expect(messages[0].text).not.toBeDefined();
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toEqual(badPath);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 0], [1, 1]]);
        })
      );
    });
  });

  describe('shows errors in a file with warnings', () => {
    let editor = null;

    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(invalidPath).then(openEditor => { editor = openEditor; })
      );
    });

    it('verifies the first message', () => {
      const messageHtml = "<span class='badge badge-flexible scss-lint'>ColorKeyword</span> " +
                          'Color `red` should be written in hexadecimal form as `#ff0000`';

      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('warning');
          expect(messages[0].html).toBeDefined();
          expect(messages[0].html).toEqual(messageHtml);
          expect(messages[0].text).not.toBeDefined();
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toEqual(invalidPath);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 20], [1, 23]]);
        })
      );
    });
  });

  it('finds nothing wrong with an empty file', () => {
    waitsForPromise(() =>
      atom.workspace.open(emptyPath).then(editor =>
        lint(editor).then(messages =>
          expect(messages.length).toEqual(0)
        )
      )
    );
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() =>
      atom.workspace.open(goodPath).then(editor =>
        lint(editor).then(messages =>
          expect(messages.length).toEqual(0)
        )
      )
    );
  });

  describe('getRelativeFilePath', () => {
    it('returns relative file path if config file is found', () => {
      const relativePath = linter.getRelativeFilePath(goodPath, configPath);
      expect(relativePath).toEqual('good.scss');
    });

    it('returns absolute file path if config file is not found', () => {
      const relativePath = linter.getRelativeFilePath(goodPath);
      expect(relativePath).toEqual(goodPath);
    });
  });
});
