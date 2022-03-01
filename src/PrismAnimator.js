class PrismAnimator {

    /**
     * User defined options.
     *
     * @type {object}
     */
    options = {};

    /**
     * @type {object}
     */
    elements = {};

    /**
     * @type {string}
     */
    language;

    /**
     * @type {string}
     */
    codeString;

    /**
     * @type {number}
     */
    codeStringlength;

    /**
     * @type {number}
     */
    currentCharacterIndex = 0;

    /**
     * @type {number}
     */
    charactersPerMinute;

    /**
     * @type {number}
     */
    fpsInterval;

    /**
     * @type {number}
     */
    _startTimestamp = 0;

    /**
     * @type {number}
     */
    _lastTimestamp = 0;

    /**
     * @param {object} options
     */
    constructor( options = {} ) {

        this.options = options;

        this.elements.parent = this.getOption( 'element' );

        this.language = this.getOption( 'language' );
        this.codeString = this.getOption( 'code' );
        this.codeStringlength = this.codeString.length;

        this.charactersPerMinute = this.getOption( 'charactersPerMinute', 200 );
        this.fpsInterval = 1000 / ( this.charactersPerMinute / 60 );

        // Sanity checks.
        if ( !( 'Prism' in window ) ) {
            throw new Error( 'Prism library not loaded' );
        } else if ( !this.elements.parent ) {
            throw new Error( `PrismAnimator is missing a required option 'element'. Pass via the constructor object e.g. new PrismAnimator( { element: document.getElementById( 'example' ) } )` );
        } else if ( !this.language ) {
            throw new Error( `PrismAnimator is missing a required option 'language'. Pass via the constructor object e.g. new PrismAnimator( { language: 'javascript' } )` );
        } else if ( !this.codeString ) {
            throw new Error( `PrismAnimator is missing a required option 'code'. Pass via the constructor object e.g. new PrismAnimator( { code: 'var example = 123;' } )` );
        } else if ( !( this.language in Prism.languages ) ) {
            throw new Error( `Language "${this.language}" not supported.` );
        }

        // Build DOM structure on init.
        this.elements.code = document.createElement( 'code' );
        this.elements.code.classList.add( `language-${this.language}` );

        this.elements.pre = document.createElement( 'pre' );
        this.elements.pre.classList.add( `language-${this.language}` );
        this.elements.pre.append( this.elements.code );

        this.elements.parent.append( this.elements.pre );

        // Add user classes to `<pre>` element
        const preClasses = this.getOption( 'preClasses', [] );

        if ( Array.isArray( preClasses ) ) {
            this.elements.pre.classList.add( ...preClasses );
        } else if ( typeof preClasses === 'string' ) {
            this.elements.pre.classList.add( preClasses );
        }

        // Add user classes to `<code>` element
        const codeClasses = this.getOption( 'codeClasses', [] );

        if ( Array.isArray( codeClasses ) ) {
            this.elements.code.classList.add( ...codeClasses );
        } else if ( typeof codeClasses === 'string' ) {
            this.elements.code.classList.add( codeClasses );
        }

        // Begin animation.
        requestAnimationFrame( this.update.bind( this ) );
    }

    getOption( key, defaultValue ) {
        return this.options[ key ] || defaultValue;
    }

    update( timestamp = 0 ) {

        if ( !this._startTimestamp ) {
            this._startTimestamp = timestamp;
            this._lastTimestamp = timestamp;
        }

        const elapsed = timestamp - this._lastTimestamp;
        const shouldDrawFrame = !window.document.hidden && elapsed > this.fpsInterval;

        if ( shouldDrawFrame ) {
            this._lastTimestamp = timestamp - ( elapsed % this.fpsInterval );
            this.currentCharacterIndex++;
            this.elements.code.innerHTML = this.codeString.substring( 0, this.currentCharacterIndex );;

            Prism.highlightElement( this.elements.code );

            if ( this.getOption( 'drawCallback' ) ) {
                this.getOption( 'drawCallback' ).apply( this );
            }
        }

        if ( this.currentCharacterIndex < this.codeStringlength ) {
            requestAnimationFrame( this.update.bind( this ) );
        }
    }

}

window.PrismAnimator = PrismAnimator;

if ( window.jQuery ) {
    jQuery.fn.prismAnimator = function( options = {} ) {

        options = $.extend( true, {
            language: 'javascript',
            code: 'var example = 123;',
            charactersPerMinute: 200,
            preClasses: '',
            codeClasses: '',
        }, options );

        this._prismAnimator = new PrismAnimator( {
            element: this.get( 0 ),
            language: options.language,
            code: options.code,
            charactersPerMinute: options.charactersPerMinute,
            preClasses: options.preClasses,
            codeClasses: options.codeClasses
        } );

        return this;
    };
}
