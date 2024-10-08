import PrismAnimator from './PrismAnimator.js'

window.PrismAnimator = PrismAnimator;

if ( window.jQuery ) {
    /**
     * @param {object} options
     * @return {PrismAnimator}
     */
    jQuery.fn.prismAnimator = function( options = {} ) {
        return new PrismAnimator( $.extend( true, {
            element: this.get( 0 )
        }, options ) );
    };
}