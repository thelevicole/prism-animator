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
     * @type {[]}
     */
    stringReplacements = [];

    /**
     * @type {number}
     * @private
     */
    _startTimestamp = 0;

    /**
     * @type {number}
     * @private
     */
    _lastTimestamp = 0;

    /**
     * @type {boolean}
     * @private
     */
    _isPaused = false;

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

        this.stringReplacements = this.getOption( 'replacements', [
            [ /&/g, '&amp;' ],
            [ /'/g, '&apos;' ],
            [ /"/g, '&quot;' ],
            [ /</g, '&lt;' ],
            [ />/g, '&gt;' ],
            [ /\r\n/g, '&#13;' ],
            [ /[\r\n]/g, '&#13;' ],
        ] );

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
        this.reset();
        this.play();
    }

    /**
     * Get an user defined option or return default.
     *
     * @param {string} key
     * @param {*} defaultValue
     * @return {*}
     */
    getOption( key, defaultValue ) {
        return this.options[ key ] || defaultValue;
    }

    /**
     * Reset the entire animation and DOM.
     */
    reset() {
        this._startTimestamp = 0;
        this._lastTimestamp = 0;
        this.currentCharacterIndex = 0;
        this.elements.code.innerHTML = '';
    }

    /**
     * Play the animation
     */
    play() {
        this._isPaused = false;
        requestAnimationFrame( this._drawFrame.bind( this ) );
    }

    /**
     * Pause the animation
     */
    pause() {
        this._isPaused = true;
    }

    /**
     * @param timestamp
     * @private
     */
    _drawFrame( timestamp = 0 ) {

        if ( !this._startTimestamp ) {
            this._startTimestamp = timestamp;
            this._lastTimestamp = timestamp;
        }

        const elapsed = timestamp - this._lastTimestamp;
        const shouldDrawFrame = !window.document.hidden && elapsed > this.fpsInterval;

        if ( shouldDrawFrame ) {
            this._lastTimestamp = timestamp - ( elapsed % this.fpsInterval );
            this.currentCharacterIndex++;
            this.elements.code.innerHTML = this.escapeString( this.codeString.substring( 0, this.currentCharacterIndex ) );

            Prism.highlightElement( this.elements.code );

            if ( this.getOption( 'drawCallback' ) ) {
                this.getOption( 'drawCallback' ).apply( this );
            }
        }

        if ( this.currentCharacterIndex < this.codeStringlength && !this._isPaused ) {
            this.play();
        }
    }

    /**
     * Basic string escaping. Disabed by passing an empty array to the `replacements` option i.e. { replacements: [] }
     *
     * @param inputString
     * @return {string}
     */
    escapeString( inputString ) {
        let string = '' + inputString;

        const replacements = this.stringReplacements;

        for ( let i = 0; i < replacements.length; i++ ) {
            string = string.replace( ...replacements[ i ] );
        }

        if ( this.getOption( 'escapeCallback' ) ) {
            string = this.getOption( 'escapeCallback' ).apply( this, [ string, replacements, inputString ] );
        }

        return string;
    }

}

export default PrismAnimator