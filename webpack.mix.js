const mix = require( 'laravel-mix' );

mix.setPublicPath( './dist' );
mix.js( 'src/PrismAnimator.js', 'prism-animator.js' );
