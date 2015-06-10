//Node namespaces
var TemplateHandler = require("./Template.js");
var CssParser = require("./CssParser.js");

/**
 * Module to create HTML from section structured object
 * @param {Object} config Object of config values
 */
function Compiler(config) {
	this.config = config;
	this.templatePath = config.templatePath;
	this.cssParser = new CssParser(config.uncompiledCssPath, config.cssCompiler);
	this.templateHandler = new TemplateHandler(this.templatePath, config.styleguideTitle);
};

/**
 * Run the parser and generate templates for all sections. 
 * @return {String} String representation of the HTML inner for the styleguide.
 */
Compiler.prototype.compile = function() {
	var sources = this.cssParser.getSectionData();
	var template = '';
	var menu = '';

	if(sources && sources.children) {
		for(var i=0; i<sources.children.length; i++) {
			template = template + this.loopSection(sources.children[i], 0, (i + 1));
			menu = menu + this.loopMenu(sources.children[i], 0, (i + 1), 'section-' + (i + 1));
		}
	} else {
		template = this.templateHandler.noContentTemplate();
	}

	return this.templateHandler.wrapMenuTemplate(menu)+this.templateHandler.wrapMainTemplate(template);
};

/**
 * Iterative walk over the sections and append tempalates
 * @param  {Array} arr   Section array
 * @param  {int} level   Integer showing current hierarchy level
 * @param  {String} id   Tag for links and anchors
 * @return {String}      Section as HTML String
 */
Compiler.prototype.loopSection = function(arr, level, id) {
	var template = "";
	if(!arr) { 
		return;
	}

	var innerTemplate = "";
	if(arr.description) {
		innerTemplate = innerTemplate + this.templateHandler.getSectionDescription(arr.description);
	}
	if(arr.template) {
		innerTemplate = innerTemplate + this.templateHandler.get(arr.template);
	}
	if(arr.detectedColors) {
		innerTemplate = innerTemplate + this.templateHandler.renderColorList(arr.detectedColors, arr["color-list"]);
	}

	if(arr.children) {
		for(var i=0; i<arr.children.length; i++){
			if(arr.children[i]) {
				innerTemplate = innerTemplate + this.loopSection(arr.children[i], level + 1, id + "-" + (i + 1));
			}
		}
	}

	template = template + this.templateHandler.getSectionTemplate(level, arr.title, id, innerTemplate);

	return template;
};

/**
 * Iterative walk over the sections for menu generation
 * @param  {Array} arr     Section array
 * @param  {int} level     Integer showing current hierarchy level
 * @param  {String} id     Tag for links and anchors
 * @param  {String} page   Associated page for the data link
 * @return {String}        Section as HTML String
 */
Compiler.prototype.loopMenu = function(arr, level, id, page) {
	if(!arr) {
		return '';
	}
	
	var template = '';
	var secTitle = arr.title ? ': '+ arr.title : "";

	if(arr.children) {
		template = template + this.templateHandler.getMenuSection(id, page, id + secTitle);
		var subTemplate = "";

		for(var i=0; i<arr.children.length; i++) {
			if(arr.children[i]) {
				subTemplate = subTemplate + this.loopMenu(arr.children[i], level + 1, id + "-" + (i + 1), page);
			}
		}
		template = template + this.templateHandler.wrapListSection(subTemplate);

	} else {
		var title = arr.title ? arr.title : id;
		template = template + this.templateHandler.getMenuSection(id, page, id + ': '+ title);
	}

	return this.templateHandler.wrapInnerMenuTemplate(template);
};

module.exports = Compiler;