let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// mix.css([
//     './node_modules/jquery/dist/jquery.js',
// ], 'vendor.css');

mix.js([
   './resources/assets/js/bootstrap.js',
   // './node_modules/jquery/dist/jquery.js',
   // './node_modules/datatables/media/js/jquery.dataTables.js',
], 'public/js/vendor.js')

mix.react('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css');
