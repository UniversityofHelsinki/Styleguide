//Node namespaces
var fs = require("fs");
var FileGetContents = require("./FileGetContents.js");

/**
 * Fetches the overrideCss (creates it if it does not exist).
 * @param  {String} path     Path to file.
 * @param  {String} filename Filename.
 */
function getOverrideCss(path, filename) {
	var oCss = new PersistantFile(path, filename);
	
	return oCss.getContent();
	
}

module.exports = getOverrideCss;

/**
 * Handler for the persistant file. (file is created if it does not exist)
 * @param  {String} path     Path to file.
 * @param  {String} filename Filename.
 */
function PersistantFile(path, filename) {
	this.path = path;
	this.filename = filename;
	this.fullPath = path + filename;
	this.cssContent = '';
	
	if(!this.fileExists()) {
		this.createOverrideFile();
	}
};

/**
 * Checks if file exists.
 * @return  {Bool}
 */
PersistantFile.prototype.fileExists = function() {
	var exists = false;

	if(fs.existsSync(this.fullPath)) {
		exists = true;
	}
	
	return exists;
};

/**
 * Loads the contents of the file.
 */
PersistantFile.prototype.loadFileContents = function() {
	this.cssContent = FileGetContents(this.fullPath);
};

/**
 * Touches the file.
 */
PersistantFile.prototype.createOverrideFile = function() {
	fs.closeSync(fs.openSync(this.fullPath, 'a'));
};

/**
 * Returns the content of the file.
 * @return  {String} The content of the file
 */
PersistantFile.prototype.getContent = function() {
	this.loadFileContents();
	
	return this.cssContent;
};