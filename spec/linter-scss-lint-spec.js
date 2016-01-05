'use babel';

describe('The scss_lint provider for Linter', () => {
  const lint = require('../lib/init').provideLinter().lint;

  beforeEach(() => {
    atom.workspace.destroyActivePaneItem();
    waitsForPromise(() => {
      atom.packages.activatePackage('linter-scss-lint');
      return atom.packages.activatePackage('language-sass').then(() =>
        atom.workspace.open(__dirname + '/fixtures/good.scss')
      );
    });
  });

  describe('checks bad.scss and', () => {
    let editor = null;
    beforeEach(() => {
      waitsForPromise(() => {
        return atom.workspace.open(__dirname + '/fixtures/bad.scss').then(openEditor => {
          editor = openEditor;
        });
      });
    });

    it('finds at least one message', () => {
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages.length).toBeGreaterThan(0);
        });
      });
    });

    it('verifies the first message', () => {
      const messageText = 'Syntax Error: Invalid CSS after "body {": expected "}", was ""';
      waitsForPromise(() => {
        return lint(editor).then(messages => {
          expect(messages[0].type).toBeDefined();
          expect(messages[0].type).toEqual('error');
          expect(messages[0].text).toBeDefined();
          expect(messages[0].text).toEqual(messageText);
          expect(messages[0].filePath).toBeDefined();
          expect(messages[0].filePath).toMatch(/.+bad\.scss$/);
          expect(messages[0].range).toBeDefined();
          expect(messages[0].range.length).toEqual(2);
          expect(messages[0].range).toEqual([[1, 0], [1, 1]]);
        });
      });
    });
  });

  it('finds nothing wrong with a valid file', () => {
    waitsForPromise(() => {
      return atom.workspace.open(__dirname + '/fixtures/good.scss').then(editor => {
        return lint(editor).then(messages => {
          expect(messages.length).toEqual(0);
        });
      });
    });
  });
});
