# pHTML Include [<img src="https://phtmlorg.github.io/phtml/logo.svg" alt="pHTML" width="90" height="90" align="right">][phtml]

[![NPM Version][npm-img]][npm-url]
[![Build Status][cli-img]][cli-url]
[![Support Chat][git-img]][git-url]

[pHTML Include] lets you embed HTML partials into HTML.

```html
<!doctype html>
<html>
  <head>
    <title>phtml-include</title>
  </head>
  <body>
    <!-- where _body.html is <h1>Body Partial</h1> -->
    <include src="_body.html" />
  </body>
</html>

<!-- becomes -->

<!doctype html>
<html>
  <head>
    <title>phtml-include</title>
  </head>
  <body>
    <h1>Body Partial</h1>
  </body>
</html>
```

## Usage

Add [pHTML Include] to your project:

```bash
npm install @phtml/include --save-dev
```

Use [pHTML Include] to process your HTML:

```js
const phtmlInclude = require('@phtml/include');

phtmlInclude.process(YOUR_HTML /*, processOptions, pluginOptions */);
```

Or use it as a [pHTML] plugin:

```js
const phtml = require('phtml');
const phtmlInclude = require('@phtml/include');

phtml([
  phtmlInclude(/* pluginOptions */)
]).process(YOUR_HTML /*, processOptions */);
```

[pHTML Include] runs in all Node environments, with special instructions for:

| [Node](INSTALL.md#node) | [pHTML CLI](INSTALL.md#phtml-cli) | [Webpack](INSTALL.md#webpack) | [Create React App](INSTALL.md#create-react-app) | [Gulp](INSTALL.md#gulp) | [Grunt](INSTALL.md#grunt) |
| --- | --- | --- | --- | --- | --- |

## Options

### cwd

The `cwd` option defines and overrides the current working directory of includes.

```js
// resolve all relative includes to /some/absolute/path
phtmlInclude({ cwd: '/some/absolute/path' });
```

[cli-img]: https://img.shields.io/travis/phtmlorg/phtml-include.svg
[cli-url]: https://travis-ci.org/phtmlorg/phtml-include
[git-img]: https://img.shields.io/badge/support-chat-blue.svg
[git-url]: https://gitter.im/phtmlorg/phtml
[npm-img]: https://img.shields.io/npm/v/@phtml/include.svg
[npm-url]: https://www.npmjs.com/package/@phtml/include

[pHTML]: https://github.com/phtmlorg/phtml
[pHTML Include]: https://github.com/phtmlorg/phtml-include
