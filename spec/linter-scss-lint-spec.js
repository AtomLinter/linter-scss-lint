'use babel';

import * as path from 'path';

const goodPath = path.join(__dirname, 'fixtures', 'good.scss');
const badPath = path.join(__dirname, 'fixtures', 'bad.scss');

describe('The scss_lint provider for Linter', () => {
  const lint = require(path.join('..', 'lib', 'init')).provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-scss-lint');
      return atom.packages.activatePackage('language-sass').then(() =>
        atom.workspace.open(goodPath)
      );
    });
  });

  describe('checks bad.scss and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() =>
        atom.workspace.open(badPath).then(openEditor => { editor = openEditor; })
      );
    });

    it('finds at least one message', () => {
      waitsForPromise(() =>
        lint(editor).then(messages =>
          expect(messages.length).toBeGreaterThan(0)
        )
      );
    });

    it('verifies the first message', () => {
      const messageText = 'Syntax Error: Invalid CSS after "body {": expected "}", was ""';
      waitsForPromise(() =>
        lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual(messageText);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+bad\.scss$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 0], [1, 1]]);
        })
      );
    });
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
});
