//Node namespaces
var fs = require("fs");

/**
 * Fetches contents of a file. (returns an empty string if file doesn't exist).
 * @param  {String} filePath Path to file.
 * @return {String}       	 Contents
 */
function fileGetContents(filePath) {
	var contents = '';
	try {
		contents = fs.readFileSync(filePath).toString();
	} catch(e) {
		contents = '';
	}
	
	return contents;
}

module.exports = fileGetContents;