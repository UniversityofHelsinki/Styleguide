//Node namespaces
var fs = require("fs");

/**
 * Module for retrieving and embedding template files
 * @param {String} templatePath Path to the template directory
 * @param {String} title Title used on main headings.
 */
function Template(templatePath, title) {
	this.templatePath = templatePath;
	this.title = title || '';
};

/**
 * If there is no content put an error message
 * @return {String} HTML string of error message
 */
Template.prototype.noContentTemplate = function(){
	return '<h1>No content found, please either add some comments or check your configuration file</h1>'
}

/**
 * Get templates for static body
 * @param  {String} inner 	HTML for inner content
 * @return {String} HTML of main body template
 */
Template.prototype.wrapMainTemplate = function(inner){
	var template = '<div class="idean-styleguide-responsive-section">';
	template = template + inner;
	template = template + '</div>';
	return template;
}

/**
 * Get templates for static menu
 * @param  {String} inner 	HTML for inner content
 * @return {String} HTML of Menu
 */
Template.prototype.wrapMenuTemplate = function(inner){
	var template = '<div class="idean-styleguide-menu">'+
				'<a href="#" class="idean-styleguide-menu-button lines-button">'+
					'<span class="lines"></span>'+
				'</a>'+
				'<div class="idean-styleguide-menu-container">';

	template = template + inner;
	template = template + '</div></div>';
	return template;
}
/**
 * Get templates for static menu
 * @param  {String} inner 	HTML for inner content
 * @return {String} HTML of Menu
 */
Template.prototype.wrapInnerMenuTemplate = function(inner){
	return '<ul>'+ inner +'</ul>';
}

/**
 * Starting template with title and link elements for collapse wrapping inner content
 * @param  {int} level 		Integer for the level
 * @param  {String} title 	Title of the section
 * @param  {String} id    	Link ID for the section
 * @param  {String} inner 	HTML for inner content
 * @return {String}       	HTML Template start
 */
Template.prototype.getSectionTemplate = function(level, title, id, inner){
	var template = "";
	var section = level === 0 ? 'section' : 'div';
	var sectionClass = level === 0 ? 'class="idean-styleguide-page"' : 'class="idean-styleguide-subsection"';
	var secTitle = title ? ': '+ title : "";
	var colorList = '';
	template = '<'+ section +' '+ sectionClass +' id="section-'+ id +'">';

	if(level === 0){
		template = template + '<header class="idean-styleguide-header">'+
				'<h1 class="idean-styleguide-title">'+
					'<a class="idean-styleguide-link" href="#section-'+ id +'">' + this.title + ': '+id + secTitle + '</a>'+
				'</h1>'+
			'</header>';
		template = template + '<a href="#" class="idean-styleguide-link idean-styleguide-collapse all">Collapse Section</a>';
	}
	else{
		template = template + '<h2 class="idean-styleguide-section-title"><a class="idean-styleguide-link" href="#section-'+ id +'">Section '+ id + secTitle +'</a></h2>';
	}
	
	template = template + inner;

	template = template + '</'+ section +'>';

	return template
}
/**
 * Put description in a templated wrapper
 * @param  {String} description Description string
 * @return {String}             HTML template
 */
Template.prototype.getSectionDescription = function(description){
	return '<p class="idean-styleguide-description">'+ description +'</p>';
}

/**
 * Get menu item template
 * @param  {String} id    ID for section
 * @param  {String} page  Data page ID
 * @param  {String} title Title for entry
 * @return {String}       HTML template
 */
Template.prototype.getMenuSection = function(id, page, title){
	return '<li><a class="idean-styleguide-link" href="#section-'+ id +'" data-page="'+ page +'">Section '+ title +'</a></li>';
}

/**
 * Wrap template in list subsection
 * @param  {String} template 	HTML string to wrap
 * @return {String}				HTML template closure
 */
Template.prototype.wrapListSection = function(template){
	return '<li><ul>'+ template +'</ul></li>';
}

/**
 * Retrieve the template of name, or create stub if not already created.
 * @param  {String} name Name of the file to load
 * @return {String}      HTML output of the template and wrapper code.
 */
Template.prototype.get = function(name) {
	if(!fs.existsSync(this.templatePath)) {
		fs.mkdirSync(this.templatePath);
	}

	var completePath = this.templatePath + name + ".html";
	if(!fs.existsSync(completePath)) {
		fs.writeFileSync(completePath, '<h1>This file is scaffolded, to edit it please replace this in file at: <a href="'+ completePath +'">'+ completePath +'</a></h1>');
	}
	
	var code = fs.readFileSync(completePath, "utf8");
	var output = '<div>'+
					'<div class="idean-styleguide-demo-block">'+
						'<div class="idean-styleguide-demo-example">'+ code +'</div>'+
						'<a href="#" class="idean-styleguide-fullscreen idean-styleguide-link">Full Screen</a>'+
					'</div>'+
					'<div class="idean-styleguide-code">'+
						'<a href="#" class="idean-styleguide-collapse idean-styleguide-link">Collapse</a>'+
						'<pre style="display:none;"><code class="language-markup">'+ code.replace(/</g, '&lt;').replace(/>/g, '&gt;') +'</code></pre>'+
						'<p class="idean-styleguide-selected-message">Code block selected, Ctrl+C/Cmd+C to copy</p>'+
					'</div>'+
				'</div>';
	
	return output;
};

/**
 * Turn color listing into HTML markup
 * @param  {Object} colors name:val pairs of colors to export
 * @param  {String} type   One of the supported standards "list" or "grid"
 * @return {String}        HTML markup to inject to styleguide
 */
Template.prototype.renderColorList = function(colors, type) {
	if(type !== "grid" && type !== "list") {
		throw new Error("Invalid color-list type.");
	}

	var output = '<ul class="idean-styleguide-colors-' + type + ' clearfix">';
	
	for (var i = 0; i < colors.length; i++) {
		output = output.concat('<li class="idean-styleguide-colors-' + type + '-sample" style="background:'+ colors[i][1] +'"><span class="idean-styleguide-colors-' + type + '-label">'+ colors[i].join(" ") +'</span></li>');
	};
	
	output = output.concat('</ul>');

	return output;
};

module.exports = Template;