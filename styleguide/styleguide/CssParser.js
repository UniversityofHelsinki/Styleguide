//Node namespaces
var fs = require("fs");
var extend = require("./Extend.js");
var Colors = require("./Colors.js");

/**
 * Module designed get all CSS and create a readable hierarchy object from the content
 * @param {String} uncompiledCssPath Path to uncompiled CSS root
 * @param {String} cssCompiler       One of the supported compiler types, sass, less or stylus
 */
function CssParser(uncompiledCssPath, cssCompiler) {
	this.uncompiledCssPath = uncompiledCssPath;
	this.cssCompiler = cssCompiler;
	this._concatenatedCss = false;
	this.colorParser = new Colors(this, cssCompiler);
};

/**
 * Retrieve all files of type and return concatinated String
 * @return {String}      Concatinated string of all the CSS.
 */
CssParser.prototype.getCssContents = function() {
	if(!this._concatenatedCss) {
		var css = "";
		var fileList = this.deepReadDirSync(this.uncompiledCssPath);
		var targetList = [];
		var i;
	
		if(this.cssCompiler === "sass") {
			for (i = fileList.length - 1; i >= 0; i--) {
				if(fileList[i].match(/\.s[ca]ss$/)) {
					targetList.push(fileList[i]);
				}
			}
		} else if(this.cssCompiler === "less") {
			for (i = fileList.length - 1; i >= 0; i--) {
				if(fileList[i].match(/\.less$/)) {
					targetList.push(fileList[i]);
				}
			}
		} else if(this.cssCompiler === "stylus") {
			for (i = fileList.length - 1; i >= 0; i--) {
				if(fileList[i].match(/\.stylus$/)) {
					targetList.push(fileList[i]);
				}
			}
		}
		
		for (i = targetList.length - 1; i >= 0; i--) {
			css = css.concat(fs.readFileSync(targetList[i]).toString());
		}
	
		this._concatenatedCss = css;
	}
	
	return this._concatenatedCss;
};

/**
 * Recursively walk over directory and return files
 * @param  {String} path Root directory to walk over
 * @return {Array}      Names of files with full directory structure.
 */
CssParser.prototype.deepReadDirSync = function(path){
    
    var walk = function(dir) {
        var results = [];
        var list = fs.readdirSync(dir);
        if(list.length === 0) return results;

        list.forEach(function(file) {
            file = dir + '/' + file;
            var stat = fs.statSync(file);
            if (stat && stat.isDirectory()) {
                var deeper = walk(file);
                results = results.concat(deeper);
            } else {
                results.push(file);
            }
        });

        return results;
    };
    
    return walk(path);
};

/**
 * Build the hierarchy object from the CSS of type and return as an object
 * @return {Object}      Object representing the hierarchy of the CSS comments.
 */
CssParser.prototype.getSectionData = function(){
	var css = "";
	var cssComment = [];
	var styleSection = {};
	var i;

	var css = this.getCssContents();

	cssComment = css.match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g);
	
	if(cssComment){
		for (i = cssComment.length - 1; i >= 0; i--) {
			cssComment[i].replace("/*", "").replace("*/", "");
			var obj = {};
			var lines = cssComment[i].match(/[^\r\n]+/g);
			var current;

			//Split each line at the first colon, if section create a subcategory
			//Otherwise just store in the object as key:val.
			for (var j = lines.length - 1; j >= 0; j--) {
				var cut = lines[j].split(":");
				if(cut.length > 1) {
					var key = cut[0].trim();
					cut.shift();
					var sec = cut.join(":").trim();

					if(key.toLowerCase() === "section") {
						obj.section = sec;
						var sections = sec.split(".");

						current = styleSection;
						for(var k = 0; k<sections.length; k++) {
							var id = +sections[k]-1;
							if(!current.children) current.children = [];
							if(!current.children[id]) current.children[id] = {};
							current = current.children[id];
						}
					} else {
						obj[key] = sec;
					}
				}
			}

			//If the section already exists throw a warning to the console
			//TODO: automatically do something about this that is more helpful in short term.
			if(current && obj.section) {
				if(current.title || current.template) {
					console.log(current + "\nWarning! Duplicate index: Overwriting section " + obj.section + "\n")
				}
				
				extend(current, obj);
			}
		}

		//Run the color parsing to add color information
		this.colorParser.mapColors(styleSection);
	}

	return styleSection;
};

module.exports = CssParser;