var http = require('http-server');
var fs = require('fs');
var child_process = require('child_process');
var port = 8181;

// Go in to the style guide generator directory
process.chdir('styleguide/');

// Build the style guide.
child_process.execFile('node', ['build'], function(error, stdout, stderr){
	console.log(stdout);
	// Start server.
	startServer();
});

/**
 * Starts the http-server
 */
function startServer() {
	// Go back up to the base path. 
	process.chdir('../');
	
	// Read index.html
	var index = fs.readFileSync('index.html');
	
	// Start server
	console.log('You can view the style guide on: http://localhost:' + port);
	http.createServer(
		function (req, res) {
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(index);
		}
	).listen(port);	
}
