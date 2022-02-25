class PrismAnimator {

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
     * @param {HTMLElement} targetElement
     * @param {string} language
     * @param {string} code
     * @param {number} charactersPerMinute
     */
    constructor( targetElement, language, code, charactersPerMinute = 200 ) {

        this.language = language;
        this.codeString = code;
        this.codeStringlength = code.length;

        this.charactersPerMinute = charactersPerMinute;
        this.fpsInterval = 1000 / ( this.charactersPerMinute / 60 );

        // Sanity checks.
        if ( !( 'Prism' in window ) ) {
            throw new Error( 'Prism library not loaded' );
        } else if ( !( this.language in Prism.languages ) ) {
            throw new Error( `Language "${this.language}" not supported.` );
        }

        // Build DOM structure on init.
        this.elements.parent = targetElement;

        this.elements.code = document.createElement( 'code' );
        this.elements.code.classList.add( `language-${this.language}` );

        this.elements.pre = document.createElement( 'pre' );
        this.elements.pre.classList.add( `language-${this.language}` );
        this.elements.pre.append( this.elements.code );

        this.elements.parent.append( this.elements.pre );

        // Begin animation.
        requestAnimationFrame( this.update.bind( this ) );
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
            const part = this.codeString.substring( 0, this.currentCharacterIndex );
            this.elements.code.innerHTML = Prism.highlight( part, Prism.languages[ this.language ], this.language );
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
            cpm: 200
        }, options );

        this._prismAnimator = new PrismAnimator( this.get( 0 ), options.language, options.code, options.cpm );

        return this;
    };
}