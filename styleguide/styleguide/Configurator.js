var fs = require("fs");

/**
 * Module for external configuration file
 * @param {String} configfile Path to the config file
 */
function Configurator(configfile) {
	//Compiler default variables
	this.configfile = configfile;
	this.templatePath = "templates/";
	this.styleguideTitle = 'Idean Style Guide';
	this.compiledCssPath = "../css/style.css";
	this.uncompiledCssPath = "../css/";
	this.output = "styleguide.html";
	this.cssCompiler = "less";
	
	this.hasConfig = fs.existsSync(this.configfile);
	
	if(this.hasConfig) {
		this.loadConfiguration();
	}
};

/**
 * Load external config file and populate defaults
 */
Configurator.prototype.loadConfiguration = function() {
	var readData = fs.readFileSync(this.configfile);
	var myConfig = JSON.parse(readData);
	
	if(myConfig.compiledCssPath) {
		this.compiledCssPath = myConfig.compiledCssPath;
	}
	if(myConfig.uncompiledCssPath) {
		this.uncompiledCssPath = myConfig.uncompiledCssPath;
	}
	if(myConfig.output) {
		this.output = myConfig.output;
	}
	if(myConfig.cssCompiler) {
		this.cssCompiler = myConfig.cssCompiler;
	}
	if(myConfig.templatePath) {
		this.templatePath = myConfig.templatePath;
	}
	if(myConfig.styleguideTitle) {
		this.styleguideTitle = myConfig.styleguideTitle;
	}
};

/**
 * Return the current configuration settings as an object
 * @return {Object} Configuration object
 */
Configurator.prototype.getConfiguration = function() {
	return {
		templatePath: this.templatePath,
		compiledCssPath: this.compiledCssPath,
		uncompiledCssPath: this.uncompiledCssPath,
		output: this.output,
		cssCompiler: this.cssCompiler,
		styleguideTitle: this.styleguideTitle
	}	
};

/**
 * Check if the path has .css otherwise append and save to local value
 * @param  {String} text Path to compiled CSS
 * @return {Bool}        test passed
 */
Configurator.prototype.validateCompiledCssPath = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();
	
	if(text.length > 0) {
		if(text.indexOf(".css", text.length - 4) === -1){
			text = text+".css";
		}
		
		this.compiledCssPath = text;
	}
	
	console.log("Compiled CSS file set to: "+this.compiledCssPath);
	return pass;
};

/**
 * Validate file path and save to local value
 * @param  {String} text Path to root uncompiled CSS folder
 * @return {Bool}        test passed
 */
Configurator.prototype.validateUncompiledCssPath = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();
	
	if(text.length > 0) {
		if(text.indexOf("/", text.length - 1) === -1) {
			text = text+"/";
		}
		
		this.uncompiledCssPath = text;
	}
	
	console.log("Uncompiled folder set to: "+this.uncompiledCssPath);
	return pass;
};

/**
 * Check if the path has .html otherwise append and save to local value
 * @param  {String} text Path to file to output
 * @return {Bool}        test passed
 */
Configurator.prototype.validateOutput = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();
	
	if(text.length > 0) {
		if(text.indexOf(".html", text.length - 5) === -1) {
			text = text+".html";
		}
		
		this.output = text;
	}
	
	console.log("Output file set to: "+this.output);
	return pass;
};

/**
 * Check if the css compiler is valid and save to local value
 * @param  {String} text Css compiler
 * @return {Bool}        test passed
 */
Configurator.prototype.validateCssCompiler = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();
	
	if(text.length > 0) {
		if(text.toLowerCase() === "less") {
			this.cssCompiler = "less";
		} else if(text.toLowerCase() === "sass") {
			this.cssCompiler = "sass";
		} else if(text.toLowerCase() === "stylus") {
			this.cssCompiler = "stylus";
		} else {
			console.log("Unsupported compiler, we only support less, sass or stylus!");
			pass = false;
		}
	}
	
	if(pass) {
		console.log("Compiler set to: "+this.cssCompiler);
	}
	
	return pass;
};

/**
 * Validates the path to the templates.
 * @param  {String} text Template path
 * @return {Bool}        test passed
 */
Configurator.prototype.validateTemplatePath = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();
	
	if(!text) {
		text = this.templatePath;
	}
	
	try {
		var stats = fs.lstatSync(text);
		if (stats.isDirectory()) {
			this.templatePath = text;
		} else {
			pass = false;
		}
	} catch (e) {
		pass = false;
	}
	
	return pass;
};

/**
 * Validates the style guide title.
 * @param  {String} text The style guide title
 * @return {Bool}        test passed
 */
Configurator.prototype.validateStyleguideTitle = function(text) {
	var pass = true;
	text = text.replace("\r\n", "").replace("\n","").trim();

	if(text) {
		this.styleguideTitle = text;
	}
	
	return pass;
};

/**
 * Save the data to an external file for future use
 * @param  {function} onSuccess Function to run on successful configuration
 */
Configurator.prototype.completeInput = function(onSuccess) {
	process.stdin.pause();

	var writeData = JSON.stringify(this.getConfiguration());

	fs.writeFile(
		this.configfile,
		writeData,
		function (err) {
			if (err) {
				console.log('There has been an error saving your configuration data.');
				console.log(err.message);
				return false;
			}
			if(typeof onSuccess === 'function') {
				onSuccess();
			}
			console.log("Config Saved");
			return true;
		}
	);
};

/**
 * Start up the configuration process, prompt the user for needed settings.
 * @param  {function} onSuccess Function to run on successful configuration
 */
Configurator.prototype.configurate = function(onSuccess) {
	var step = 0;
	var steps = [
		"Path to the compiled CSS file", 
		"Path to root folder of uncompiled CSS", 
		"output file name", 
		"css compiler: less, sass or stylus", 
		"Path to templates",
		"Title of the style guide"
	];
	var stepVal = [
		this.compiledCssPath, 
		this.uncompiledCssPath, 
		this.output, 
		this.cssCompiler, 
		this.templatePath,
		this.styleguideTitle
	];
	
	console.log(steps[0]+" Default:"+stepVal[step]);
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
	
	process.stdin.on(
		'data', 
		function (text) {
			var pass = true;
			switch(step){
				case 0: 
					pass = this.validateCompiledCssPath(text); 
				break;
				case 1: 
					pass = this.validateUncompiledCssPath(text); 
				break;
				case 2: 
					pass = this.validateOutput(text); 
				break;
				case 3: 
					pass = this.validateCssCompiler(text); 
				break;
				case 4: 
					pass = this.validateTemplatePath(text); 
				break;
				case 5: 
					pass = this.validateStyleguideTitle(text); 
				break;
				default: 
					pass = false; 
				break;
			}
			
			if(pass) {
				step ++;
				if(step >= steps.length){
					this.completeInput(onSuccess);
				} else {
					console.log(steps[step]+" Default: "+stepVal[step]);
				}
			}
		}.bind(this)
	);
};

module.exports = Configurator;