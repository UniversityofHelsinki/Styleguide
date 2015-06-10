//Node namespaces
var fs = require("fs");
var FileGetContents = require("./styleguide/FileGetContents.js");
var OverrideCss = require("./styleguide/OverrideCss.js");
var Configurator = require("./styleguide/Configurator.js");
var Compiler = require("./styleguide/Compiler.js");
var ConfigHandler = new Configurator("styleguide.config.json");

function runProcess() {

	console.log("Beginning Idean Styleguide generation...");
	var config = ConfigHandler.getConfiguration();
	var compiler = new Compiler(config);
	var overrideCss = OverrideCss(config.templatePath, 'override.css');
	
	var header = '<!DOCTYPE html>'+
				'<head>'+
					'<meta charset="utf-8">' +
					'<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">'+
					'<title>Styleguide</title>'+
					'<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">'+
					'<style>' + FileGetContents(config.compiledCssPath) + '</style>' +
					'<style>' + FileGetContents('css/styleguide.css') + '</style>' +
					'<style>' + overrideCss + '</style>' +
					'<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">'+
					'<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">'+
				'</head>'+
				'<body id="idean-styleguide" class="idean-styleguide-body">';

	var footer = '<div class="idean-styleguide-popup" style="display:none;">'+
					'<a href="#" class="idean-styleguide-popup-close">Close</a>'+
					'<div class="idean-styleguide-popup-code"></div>'+
				'</div>'+
				'<footer class="idean-styleguide-footer">'+
					'<a href="http://www.idean.com" class="idean-styleguide-branding">Idean</a>'+
				'</footer>'+
				'<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>'+
				'<script>window.jQuery || document.write(\'<script src="js/jquery-1.11.0.min.js"><\\/script>\')</script>'+
				'<script>' + FileGetContents('js/script.js') + '</script>'+
				'</body>'+
			'</html>';

	var content = compiler.compile();

	console.log("Outputting Idean Styleguide to: "+config.output);
	try{
		fs.writeFileSync(config.output, header + content + footer);
		console.log("Idean Styleguide complete!");
	}
	catch(err){
		throw new Error('Idean Styleguide failed! Could not write to file: '+config.output);
	}
}

//Init the config from file, otherwise start creation of new
if(ConfigHandler.hasConfig) {
	runProcess();
} else {
	ConfigHandler.configurate(
		runProcess
	);
}