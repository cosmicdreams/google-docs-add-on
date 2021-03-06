const simpleTagMap = {
	ITALIC: 'i',
	STRIKETHROUGH: 's',
	BOLD: 'b',
	UNDERLINE: 'u'
}

/**
 * Return an object with the unique values from the second object
 *
 * @param {object} obj1 Any old object
 * @param {object} obj2 An object similar to obj1
 * @returns {object} unique values from obj2
 */
function objectDiff( obj1, obj2 ) {
	if ( ! obj1 || ! obj2 ) {
		return {}
	}
	return Object.keys( obj2 ).reduce( ( acc, key ) => {
		if ( obj1[ key ] !== obj2[ key ] ) {
			acc[ key ] = obj2[ key ];
		}
		return acc;
	}, {} )
}

/**
 * Convert an object diff into HTML tags
 *
 * @param {object} diffParam An object with changed attributes (e.g. `{ BOLD: true }`)
 * @returns {string} HTML tags that open or close
 */
function tagsForAttrDiff( diffParam ) {
	const diff = Object.assign( {}, diffParam )
	let tags = '';

	if ( diff.LINK_URL ) {
		tags += `<a href="${ quoteattr( diff.LINK_URL ) }">`
		delete diff.UNDERLINE;
		delete diff.FOREGROUND_COLOR;
	}

	if ( diff.LINK_URL === null ) {
		tags += '</a>'
		delete diff.UNDERLINE;
		delete diff.FOREGROUND_COLOR;
	}

	for ( let prop in simpleTagMap ) {
		if ( diff[ prop ] ) {
			tags += '<' + simpleTagMap[ prop ] + '>';
		} else if ( diff[ prop ] === null ) {
			tags += '</' + simpleTagMap[ prop ] + '>';
		}
	}

	return tags
}

export const changedTags = ( elAttributes, prevAttributes ) => tagsForAttrDiff( objectDiff( prevAttributes, elAttributes ) )

/*
 * From StackOverflow - http://stackoverflow.com/a/9756789
 * (cc) by-sa 3.0 verdy-p http://stackoverflow.com/users/407132/verdy-p
 */
export function quoteattr( s, preserveCR ) {
	if ( ! s ) {
		return s;
	}

	preserveCR = preserveCR ? '&#13;' : '\n';
	return ( '' + s ) /* Forces the conversion to string. */
		.replace( /&/g, '&amp;' ) /* This MUST be the 1st replacement. */
		.replace( /'/g, '&apos;' ) /* The 4 other predefined entities, required. */
		.replace( /"/g, '&quot;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' )
		/*
		You may add other replacements here for HTML only
		(but it's not necessary).
		Or for XML, only if the named entities are defined in its DTD.
		*/
		.replace( /\r\n/g, preserveCR ) /* Must be before the next replacement. */
		.replace( /[\r\n]/g, preserveCR );
	;
}