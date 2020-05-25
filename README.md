# Basic Usage
Include the plugin in your `webpack.mix.js` file as follows:
```javascript
const mix = require('laravel-mix');
const MinifyLaravelJigsawOutputPlugin = require( 'minify-laravel-jigsaw-output-plugin' );
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
        new MinifyLaravelJigsawOutputPlugin({
	        verbose: true
        })
    ]
});
```

# Options
The below options can be passed to the plugin.

|Option|Description|Default|
|--|--|--|
| `rules` | This is an object of rules to be used by [HTMLMinifier](https://kangax.github.io/html-minifier/). | `{ collapseWhitespace: true }` |
| `env` | Set a specific build environment for dynamically guessing the out put directories. By default uses the parameter sent to webpack e.g. `npm run production` | `local` |
| `allowedEnvs` | Accepts a string or array of environment names for which minification should run. E.g. `[ 'production', 'staging' ]` will only minify production and staging builds.  | `*` |
| `verbose` | Whether or not to print logs to the console. | `false` |
| `test` | The regular expression used before modifying a file | `/\.html$/` |
| `encoding` | The file encoding used to read the output. | `utf8` |