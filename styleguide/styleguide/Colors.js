//Colours
var colorCache;

/**
 * Filter down colors into just those specified
 * @param  {Object} allColors      Source object of colors to filter
 * @param  {Array} specificColors  Color names to use as filters
 * @return {Object}                name:val object of filtered colors
 */
function filterColors(allColors, specificColors) {
	var colors = allColors;

	if(specificColors.length !== 0) {
		colors = allColors.filter(function(color) {
			if(specificColors.indexOf(color[0]) !== -1) {
				return color;
			}    
		});
	}

	return colors;
};

/**
 * Module deisgned to extract and represent colours extracted from the CSS
 * @param {CssParser} cssParser         An initialized CssParser
 * @param {String}    cssCompiler       One of the supported compiler types, sass, less or stylus
 */
function Colors(cssParser, cssCompiler) {
	this.cssParser = cssParser;
	this.cssCompiler = cssCompiler;
};

/**
 * Parse through the CSS and retrieve the name:val pairs
 * @return {Object} Name:Val pairs of all colours in the CSS
 */
Colors.prototype.parseColors = function() {

	if(!colorCache){

		var sourceCss = this.cssParser.getCssContents();
		var colorPairs = [];
		var matches = [];
		var noSpace;

		if(!sourceCss) {
			return '';	
		}

	    //Static color values as in CSS spec
	    var colorVals = 'black|silver|gray|grey|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|transparent';
	    
	    //Specific variable declarations for color for each compiler
		switch(this.cssCompiler) {
			case 'plain': 
				matches = sourceCss.split(" ");
			break;
			case 'sass': 
	            var sassReg = new RegExp("(\\$[a-zA-Z0-9_\\-]+)\\s*:\\s*(#[a-fA-F0-9]{3}\\b|#[a-fA-F0-9]{6}\\b|rgb\\(\\d{1,3},\\d{1,3},\\d{1,3}\\)|rgba\\(\\d{1,3},\\d{1,3},\\d{1,3},\\d{1,3}.?\\d{0,1}\\)" + "|" + colorVals + ")", "g");
				matches = sourceCss.match(sassReg);
			break;
			case 'less':
	            var lessReg = new RegExp("(@[a-zA-Z0-9_\\-]+)\\s*:\\s*(#[a-fA-F0-9]{3}\\b|#[a-fA-F0-9]{6}\\b|rgb\\(\\d{1,3},\\d{1,3},\\d{1,3}\\)|rgba\\(\\d{1,3},\\d{1,3},\\d{1,3},\\d{1,3}.?\\d{0,1}\\)" + "|" + colorVals + ")", "g");
				matches = sourceCss.match(lessReg);
			break;
			case 'stylus':
	            var stylusReg = new RegExp("([a-zA-Z0-9_\\-]+)\\s*=\\s*(#[a-fA-F0-9]{3}\\b|#[a-fA-F0-9]{6}\\b|rgb\\(\\d{1,3},\\d{1,3},\\d{1,3}\\)|rgba\\(\\d{1,3},\\d{1,3},\\d{1,3},\\d{1,3}.?\\d{0,1}\\)" + "|" + colorVals + ")", "g");
				matches = sourceCss.match(stylusReg);
			break;
			default: 
				return new Error("Type not matched");
			break;
		}
		
		//Trim out whitespace and split pairing per compiler spec
		if(this.cssCompiler == 'plain') {
			for (var i = 0; i < matches.length; i++) {
				noSpace = matches[i].replace(/\s/g, "");
				if(noSpace.length > 0) {
					colorPairs.push(["", noSpace]);
				}
			};
		} 
	    else if(this.cssCompiler == 'stylus'){
	        if(matches !== null) {
	            for (var i = 0; i < matches.length; i++) {
	                noSpace = matches[i].replace(/\s/g, "");
	                colorPairs.push(noSpace.split("="));
	            };
	        }
	    }
	    else {
	    	if(matches !== null) {
	    		for (var i = 0; i < matches.length; i++) {
	    			noSpace = matches[i].replace(/\s/g, "");
	    			colorPairs.push(noSpace.split(":"));
	    		};
	    	}
	    }
		
		colorCache = colorPairs;
	}
	return colorCache
};

/**
 * Check recursively check object for color list objects
 * @param  {Object} source Source object to search for color definition
 */
Colors.prototype.mapColors = function(source) {   

	var colors = this.parseColors();

	if(source["color-list"]) {
		var sourceColors = [];
		if(source["colors"]){
			sourceColors = source["colors"].split(",").map(
				function(color){
					return color.trim();
				}
			);
		}

		source.detectedColors = filterColors(colors, sourceColors);
	}

	if(source.children) {
		source.children.map(
			function(child) {
				this.mapColors(child, colors);
			}.bind(this)
		);
	}
};

module.exports = Colors;