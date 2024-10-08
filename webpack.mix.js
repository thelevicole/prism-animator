const mix = require( 'laravel-mix' );

mix.setPublicPath( './dist' );
mix.js( 'src/index.js', 'prism-animator.js' );
