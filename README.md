# Minify the Jigsaw generated output
This webkit plugin is run when the [jigsawDone](https://github.com/tightenco/laravel-mix-jigsaw/pull/14) event.

Basic Usage
-

Install with npm:
```bash
npm i @thelevicole/webkit-minify-jigsaw-output --save-dev
```

Include the plugin in your `webpack.mix.js` file as follows:
```javascript
const mix = require('laravel-mix');
const MinifyJigsawOutput = require('@thelevicole/webkit-minify-jigsaw-output');
require('laravel-mix-jigsaw');

...
```

And then add the plugin to the webkit config:
```javascript
...

mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            verbose: true
        })
    ]
});
```

The full `webpack.mix.js` should look something like...
```javascript
const mix = require('laravel-mix');
const MinifyJigsawOutput = require('webkit-minify-jigsaw-output');
require('laravel-mix-jigsaw');

mix.disableSuccessNotifications();
mix.setPublicPath('source/assets/build');

mix.jigsaw()
    .js('source/_assets/js/main.js', 'js')
    .sass('source/_assets/sass/main.scss', 'css')
    .options({
        processCssUrls: false,
    })
    .version();

mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            verbose: true
        })
    ]
});
```

Options
-

The below options can be passed to the plugin.

|Key|Description|Default|
|--|--|--|
| [`rules`](#rules) | This is an object of rules to be used by [HTMLMinifier](https://github.com/kangax/html-minifier/). | `{ collapseWhitespace: true }` |
| [`env`](#env) | Set a specific build environment for dynamically guessing the output directories. By default uses the parameter sent to webpack e.g. `npm run production` | `local` |
| [`allowedEnvs`](#allowedenvs) | Accepts a string or array of environment names for which minification should run. E.g. `[ 'production', 'staging' ]` will only minify production and staging builds.  | `*` |
| [`verbose`](#verbose) | Whether or not to print logs to the console. | `false` |
| [`test`](#test) | The regular expression used before modifying a file | `/\.html$/` |
| [`encoding`](#encoding) | The file encoding used to read the input. | `utf8` |

### `rules`

This is an object of rules will be passed **as is** to [HTMLMinifier](https://github.com/kangax/html-minifier/).
If empty, the default value is used: `{ collapseWhitespace: true }`.

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            rules: {
                caseSensitive: true,
                collapseWhitespace: true,
                minifyJS: true
            }
        })
    ]
});
```
The above example will:
- Treat attributes in case sensitive manner (useful for custom HTML tags)
- [Collapse white space that contributes to text nodes in a document tree](http://perfectionkills.com/experimenting-with-html-minifier/#collapse_whitespace)
- Minify JavaScript in script elements and event attributes (uses [UglifyJS](https://github.com/mishoo/UglifyJS2))

### `env`

Set a specific build environment for dynamically guessing the output directories.
If empty, the `env` parameter parsed to node is used.

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            env: 'production'
        })
    ]
});
```
The above example will only minify the build output in the `build_production` directory.

### `allowedEnvs`

Accepts a string or array of environment names for which minification should run. 
If empty, the default value is used: `'*'`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            allowedEnvs: ['production', 'staging']
        })
    ]
});
```
The above example will only run the minification process when the build environment is either `production` or `staging`, local will not be minified.

### `verbose`

This option  increases  the amount of information you are given during the minification process.
If empty, the default value is used: `false`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            verbose: true
        })
    ]
});
```
The above example will print a list of minified files as and when they are processed, for example:

- `[MinifyJigsawOutput] Minifing /Users/example/my-site/build_production/index.html`
- `[MinifyJigsawOutput] Minifing /Users/example/my-site/build_production/about/index.html`

### `test`

The regular expression used before to check if a file should be minified.
If empty, the default value is used: `/\.html$/`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            test: /about\/.*\.html$/
        })
    ]
});
```
The above example will only process `.html` files found in the about directory, for example:

- `/Users/example/my-site/build_production/about/index.html`
- `/Users/example/my-site/build_production/about/the-team/index.html`

> Please note that this full path is tested against the regex pattern, so the above example would minify all html files if a directory outside of the project includes "about".
> E.g.
> - /Users/**about**/my-site/build_production/index.html
> - /Users/example/project-**about**/build_production/index.html

### `encoding`

If for some reason you need to set the file encoding used to read the input source, use this option. The allowed values are determined by node.js, a good thread about supported encodings can be found here: https://stackoverflow.com/a/14551669/3804924
If empty, the default value is used: `'utf8'`

#### Example usage
```javascript
mix.webpackConfig({
    plugins: [
        new MinifyJigsawOutput({
            encoding: 'latin1'
        })
    ]
});
```