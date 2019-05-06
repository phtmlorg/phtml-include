# Installing pHTML Include

[pHTML Include] runs in all Node environments, with special instructions for:

| [Node](#node) | [CLI](#phtml-cli) | [Eleventy](#eleventy) | [Gulp](#gulp) | [Grunt](#grunt) |
| --- | --- | --- | --- | --- |

## Node

Add [pHTML Include] to your project:

```bash
npm install @phtmlorg/include --save-dev
```

Use [pHTML Include] to process your HTML:

```js
const phtmlInclude = require('@phtmlorg/include')

phtmlInclude.process(YOUR_HTML /*, processOptions, pluginOptions */)
```

Or use it as a [pHTML] plugin:

```js
const phtml = require('phtml')
const phtmlInclude = require('@phtmlorg/include')

phtml([
  phtmlInclude(/* pluginOptions */)
]).process(YOUR_HTML /*, processOptions */)
```

## CLI

Transform HTML files directly from the command line:

```bash
npx phtml source.html output.html -p @phtmlorg/include
```

Alternatively, add [pHTML Include] to your `phtml.config.js` configuration file:

```js
module.exports = {
  plugins: [
    ['@phtmlorg/include', /* pluginOptions */]
  ]
}
```

## Eleventy

Add [pHTML Eleventy] and [pHTML Include] to your Eleventy project:

```sh
npm install @phtmlorg/include @phtml/11ty --save-dev
```

Use [pHTML Eleventy] and [pHTML Include] in your Eleventy configuration:

```js
const phtml11ty = require('@phtml/11ty')
const phtmlInclude = require('@phtmlorg/include')

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(phtml11ty, {
    use: [
      phtmlInclude(/* pluginOptions */)
    ]
  })
}
```

## Gulp

Add [Gulp pHTML] and [pHTML Include] to your project:

```bash
npm install @phtmlorg/include gulp-phtml --save-dev
```

Use [Gulp pHTML] and [pHTML Include] in your Gulpfile:

```js
const gulp = require('gulp')
const gulpPhtml = require('gulp-phtml')
const phtmlInclude = require('@phtmlorg/include')

gulp.task('html',
  () => gulp.src('./src/*.html').pipe(
    gulpPhtml({
      plugins: [
        phtmlInclude(/* pluginOptions */)
      ]
    })
  ).pipe(
    gulp.dest('dist')
  )
)
```

## Grunt

Add [Grunt pHTML] to your project:

```bash
npm install grunt-phtml --save-dev
```

Use [Grunt pHTML] and [pHTML Include] in your Gruntfile:

```js
const phtmlInclude = require('@phtmlorg/include')

grunt.loadNpmTasks('grunt-phtml')

grunt.initConfig({
  phtml: {
    options: {
      plugins: [
        phtmlInclude(/* pluginOptions */)
      ]
    },
    dist: {
      files: [{
        expand: true,
        src: 'src/*.html',
        dest: 'dest'
      }]
    }
  }
})
```

[Gulp pHTML]: https://github.com/phtmlorg/gulp-phtml
[Grunt pHTML]: https://github.com/phtmlorg/grunt-phtml
[pHTML]: https://github.com/phtmlorg/phtml
[pHTML Eleventy]: https://github.com/phtmlorg/phtml-11ty
[pHTML Include]: https://github.com/phtmlorg/phtml-include
