//Node namespaces
var fs = require("fs");
var util = require("util");

var compile = function(type){
    var sources = buildCssContents(type);
    var detectedColors = [];
    var template = '';
    var menu = '';
    
    try {
        detectedColors = colorParse(type);
    } catch(e) {
        console.log("Unable to parse colors: " + e.message);
    }
    
    mapColors(sources, detectedColors);

    if(sources && sources.children){
        template = '<div class="idean-styleguide-responsive-section">';
        menu = '<div class="idean-styleguide-menu"><a href="#" class="idean-styleguide-menu-button lines-button"><span class="lines"></span></a><div class="idean-styleguide-menu-container">';

        for(var i=0; i<sources.children.length; i++){
            template = template + loopSection(sources.children[i], 0, (i+1));
            menu = menu + '<ul>'+loopMenu(sources.children[i], 0, (i+1), 'section-'+(i+1))+'</ul>';
        }

        template = template+'</div>';
        menu = menu+'</div></div>';
    }
    else{
        template = '<h1>No content found, please either add some comments or check your configuration file</h1>';
    }

    return menu+template;
}
var loopSection = function(arr, level, id){

    var template = "";
    if(!arr) return;
    if(arr.children){

        var section = level === 0 ? 'section' : 'div';
        var sectionClass = level === 0 ? 'class="idean-styleguide-page"' : 'class="idean-styleguide-subsection"';
        var secTitle = arr.title ? ': '+arr.title : "";
        var colorList = '';
        template = '<'+section+' '+sectionClass+' id="section-'+id+'">';
        template = template + (level === 0 ? '<header class="idean-styleguide-header"><h1 class="idean-styleguide-title"><a class="idean-styleguide-link" href="#section-'+id+'">Idean Style Guide: '+id+secTitle+'</a></h1></header>' : '<h2 class="idean-styleguide-section-title"><a class="idean-styleguide-link" href="#section-'+id+'">Section '+id+secTitle+'</a></h2>');
        template = template + (level === 0 ? '' : '<a href="#" class="idean-styleguide-link idean-styleguide-collapse all">Collapse Section</a>');
        if(arr.description) template = template + '<p class="idean-styleguide-description">'+arr.description+'</p>';
        if(arr.template) template = template + getTemplate(arr.template);
        if(arr.detectedColors) {
            try {
                colorList = renderColorList(arr.detectedColors, arr["color-list"]); 
            } catch(e) {
                console.log("Rendering of section " + id + " generated the following error: " + e.message);
            }
            template = template + colorList;
        }

        for(var i=0; i<arr.children.length; i++){
            if(arr.children[i]) template = template + loopSection(arr.children[i], level+1, id+"-"+(i+1));
        }

        template = template+'</'+section+'>';
    }
    else{
        var title = arr.title ? arr.title : id;

        template = template+'<div id="section-'+id+'">';
        if(level === 1) template = template+'<h2 class="idean-styleguide-section-title"><a class="idean-styleguide-link" href="#section-'+id+'">Section '+id+(arr.title ? ": "+arr.title : "")+'</a></h2>';
        else if(arr.title) template = template + '<h3 class="idean-styleguide-section-heading"><a class="idean-styleguide-link" href="#section-'+id+'">'+id+': '+arr.title+'</a></h3>';
        if(arr.description) template = template + '<p class="idean-styleguide-description">'+arr.description+'</p>';
        if(arr.template) template = template + getTemplate(arr.template);
        if(arr.detectedColors) {
            try {
                colorList = renderColorList(arr.detectedColors, arr["color-list"]); 
            } catch(e) {
                console.log("Rendering of section " + id + " generated the following error: " + e.message);
            }
            template = template + colorList;
        }        
        template = template+'</div>';
    }

    return template;
}
var loopMenu = function(arr, level, id, page){

    if(!arr) return '';
    var template = '';
    var secTitle = arr.title ? ': '+arr.title : "";

    if(arr.children){
        template = template+'<li><a class="idean-styleguide-link" href="#section-'+id+'" data-page="'+page+'">Section '+id+secTitle+'</a></li>';
        
        template = template+'<li><ul>';
        for(var i=0; i<arr.children.length; i++){
            if(arr.children[i]) template = template + loopMenu(arr.children[i], level+1, id+"-"+(i+1), page);
        }
        template = template+'</ul></li>';
    }
    else{
        var title = arr.title ? arr.title : id;
        template = template+'<li><a class="idean-styleguide-link" href="#section-'+id+'" data-page="'+page+'">'+id+': '+title+'</a></li>';
    }

    return template;
}

var getTemplate = function(path){
    if(!fs.existsSync(templatePath)){
        fs.mkdirSync(templatePath);
    }

    var completePath = templatePath + path + ".html";
    if(!fs.existsSync(completePath)){
        fs.writeFileSync(completePath, '<h1>This file is scaffolded, to edit it please replace this in file at: <a href="'+completePath+'">'+completePath+'</a></h1>');
    }
    var code = fs.readFileSync(completePath, "utf8");
    var output = '<div>';

    output = output + '<div class="idean-styleguide-demo-block"><div class="idean-styleguide-demo-example">'+code+'</div><a href="#" class="idean-styleguide-fullscreen idean-styleguide-link">Full Screen</a></div>';
    output = output + '<div class="idean-styleguide-code">';
    output = output + '<a href="#" class="idean-styleguide-collapse idean-styleguide-link">Collapse</a>';
    output = output + '<pre style="display:none;"><code class="language-markup">'+code.replace(/</g, '&lt;').replace(/>/g, '&gt;')+'</code></pre>';
    output = output + '<p class="idean-styleguide-selected-message">Code block selected, Ctrl+C/Cmd+C to copy</p>';
    output = output + '</div>';

    output = output+'</div>';
    return output;
}

var getCssContents = function(type) {
	var css = "";
    var fileList = fs.readdirSync(uncompiledCssPath);
    var targetList = [];
    var i;

    if(type === "sass"){
        for (i = fileList.length - 1; i >= 0; i--) {
            if(fileList[i].match(/\.s[ca]ss$/)) targetList.push(fileList[i]);
        }
    }
    else if(type === "less"){
        for (i = fileList.length - 1; i >= 0; i--) {
            if(fileList[i].match(/\.less$/)) targetList.push(fileList[i]);
        }
    }
    else if(type === "stylus"){
        for (i = fileList.length - 1; i >= 0; i--) {
            if(fileList[i].match(/\.stylus$/)) targetList.push(fileList[i]);
        }
    }
    for (i = targetList.length - 1; i >= 0; i--) {
        css = css.concat(fs.readFileSync(uncompiledCssPath + targetList[i]).toString());
    }

    return css;
}

var buildCssContents = function(type){
    var css = "";
    var cssComment = [];
    var i;
    var styleSection = {};

    var css = getCssContents(type);

    cssComment = css.match(/\/\*[^*]*\*+([^/*][^*]*\*+)*\//g);
    if(cssComment){

        for (i = cssComment.length - 1; i >= 0; i--) {
            cssComment[i].replace("/*", "").replace("*/", "");
            var obj = {};
            var lines = cssComment[i].match(/[^\r\n]+/g);
            var current;

            for (var j = lines.length - 1; j >= 0; j--) {
                var cut = lines[j].split(":");
                if(cut.length > 1){
                    var key = cut[0].trim();
                    cut.shift();
                    var sec = cut.join(":").trim();

                    if(key.toLowerCase() === "section"){
                        obj.section = sec;
                        var sections = sec.split(".");

                        current = styleSection;
                        for(var k = 0; k<sections.length; k++){
                            var id = +sections[k]-1;
                            if(!current.children) current.children = [];
                            if(!current.children[id]) current.children[id] = {};
                            current = current.children[id];
                        }
                    }
                    else{
                        obj[key] = sec;
                    }
                }
            }

            if(current && obj.section){
                if(current.title || current.template){
                    console.log(current+"\nWarning!Duplicate index: Overwriting section "+obj.section+"\n")
                }
                extend(current, obj);
            }
        }
    }

    return styleSection;
}

var colorParse = function(type){
	var sourceCss = getCssContents(type);
	var colorPairs = [];
	var matches = [];
	var noSpace;

	if(!sourceCss) return '';

	switch(type) {
		case 'plain': 
			matches = sourceCss.split(" ");
		break;
		case 'sass': 
			matches = sourceCss.match(/(\$[a-zA-Z0-9_\-]+)\s*:\s*(#[a-fA-F0-9]{3}\b|#[a-fA-F0-9]{6}\b|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d{1,3}.?\d{0,1}\)|black|silver|gray|grey|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|transparent)/g);
		break;
		case 'less': 
			matches = sourceCss.match(/(@[a-zA-Z0-9_\-]+)\s*:\s*(#[a-fA-F0-9]{3}\b|#[a-fA-F0-9]{6}\b|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d{1,3}.?\d{0,1}\)|black|silver|gray|grey|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|transparent)/g);
		break;
		case 'stylus': 
			matches = sourceCss.match(/([a-zA-Z0-9_\-]+)\s*=\s*(#[a-fA-F0-9]{3}\b|#[a-fA-F0-9]{6}\b|rgb\(\d{1,3},\d{1,3},\d{1,3}\)|rgba\(\d{1,3},\d{1,3},\d{1,3},\d{1,3}.?\d{0,1}\)|black|silver|gray|grey|white|maroon|red|purple|fuchsia|green|lime|olive|yellow|navy|blue|teal|aqua|orange|aliceblue|antiquewhite|aquamarine|azure|beige|bisque|blanchedalmond|blueviolet|brown|burlywood|cadetblue|chartreuse|chocolate|coral|cornflowerblue|cornsilk|crimson|darkblue|darkcyan|darkgoldenrod|darkgray|darkgrey|darkgreen|darkkhaki|darkmagenta|darkolivegreen|darkorange|darkorchid|darkred|darksalmon|darkseagreen|darkslateblue|darkslategray|darkslategrey|darkturquoise|darkviolet|deeppink|deepskyblue|dimgray|dimgrey|dodgerblue|firebrick|floralwhite|forestgreen|gainsboro|ghostwhite|gold|goldenrod|greenyellow|honeydew|hotpink|indianred|indigo|ivory|khaki|lavender|lavenderblush|lawngreen|lemonchiffon|lightblue|lightcoral|lightcyan|lightgoldenrodyellow|lightgray|lightgrey|lightgreen|lightpink|lightsalmon|lightseagreen|lightskyblue|lightslategray|lightslategrey|lightsteelblue|lightyellow|limegreen|linen|mediumaquamarine|mediumblue|mediumorchid|mediumpurple|mediumseagreen|mediumslateblue|mediumspringgreen|mediumturquoise|mediumvioletred|midnightblue|mintcream|mistyrose|moccasin|navajowhite|oldlace|olivedrab|orangered|orchid|palegoldenrod|palegreen|paleturquoise|palevioletred|papayawhip|peachpuff|peru|pink|plum|powderblue|rosybrown|royalblue|saddlebrown|salmon|sandybrown|seagreen|seashell|sienna|skyblue|slateblue|slategray|slategrey|snow|springgreen|steelblue|tan|thistle|tomato|turquoise|violet|wheat|whitesmoke|yellowgreen|transparent)/g);
		break;
		default: 
			throw new Error("Invalid CSS type in configuration.");
		break;

	}
	
	if(type == 'plain') {
		for (var i = 0; i < matches.length; i++) {
			noSpace = matches[i].replace(/\s/g, "");
			if(noSpace.length > 0) {
				colorPairs.push(["", noSpace]);
			}
		};
	} else {
		if(matches !== null) {
			for (var i = 0; i < matches.length; i++) {
				noSpace = matches[i].replace(/\s/g, "");
				colorPairs.push(noSpace.split(":"));
			};
		}
	}
    
	return colorPairs;
}

var getSpecificColors = function(allColors, specificColors) {
    var colors = allColors;
    if(specificColors.length !== 0) {
        colors = allColors.filter(function(color) {
            if(specificColors.indexOf(color[0]) !== -1) {
                return color;
            }    
        });
    }

    return colors;
}

var mapColors = function(source, colors) {        
    if(source["color-list"]) {
        var sourceColors = [];
        if(source["colors"]){
            sourceColors = source["colors"].split(",").map(function(color){
                return color.trim();
            });
        }
        
        source.detectedColors = getSpecificColors(colors, sourceColors);
    }

    if(source.children) {
        source.children.map(function(child){mapColors(child, colors)});
    }
}

var renderColorList = function(colors, type) {
    if(type !== "grid" && type !== "list") {
        throw new Error("Invalid color-list type.");
    }

    var output = '<ul class="idean-styleguide-colors-' + type + ' clearfix">';
    for (var i = 0; i < colors.length; i++) {
        output = output.concat('<li class="idean-styleguide-colors-' + type + '-sample" style="background:'+colors[i][1]+'"><span class="idean-styleguide-colors-' + type + '-label">'+colors[i].join(" ")+'</span></li>');
    };
    output = output.concat('</ul>');

    return output;
}

function extend() {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false,
        toString = Object.prototype.toString,
        hasOwn = Object.prototype.hasOwnProperty,
        push = Array.prototype.push,
        slice = Array.prototype.slice,
        trim = String.prototype.trim,
        indexOf = Array.prototype.indexOf,
        class2type = {
          "[object Boolean]": "boolean",
          "[object Number]": "number",
          "[object String]": "string",
          "[object Function]": "function",
          "[object Array]": "array",
          "[object Date]": "date",
          "[object RegExp]": "regexp",
          "[object Object]": "object"
        },
    jQuery = {
      isFunction: function (obj) {
        return jQuery.type(obj) === "function"
      },
      isArray: Array.isArray ||
      function (obj) {
        return jQuery.type(obj) === "array"
      },
      isWindow: function (obj) {
        return obj != null && obj == obj.window
      },
      isNumeric: function (obj) {
        return !isNaN(parseFloat(obj)) && isFinite(obj)
      },
      type: function (obj) {
        return obj == null ? String(obj) : class2type[toString.call(obj)] || "object"
      },
      isPlainObject: function (obj) {
        if (!obj || jQuery.type(obj) !== "object" || obj.nodeType) {
          return false
        }
        try {
          if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false
          }
        } catch (e) {
          return false
        }
        var key;
        for (key in obj) {}
        return key === undefined || hasOwn.call(obj, key)
      }
    };
  if (typeof target === "boolean") {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }
  if (typeof target !== "object" && !jQuery.isFunction(target)) {
    target = {}
  }
  if (length === i) {
    target = this;
    --i;
  }
  for (i; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) {
          continue
        }
        if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && jQuery.isArray(src) ? src : []
          } else {
            clone = src && jQuery.isPlainObject(src) ? src : {};
          }
          // WARNING: RECURSION
          target[name] = extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
  return target;
}

//Compiler default variables
var configfile = "styleguide.config.json";   //The complete CSS file
var templatePath = "templates/";         //Root folder for the template folder

var compiledCssPath = "../css/style.css";   //The complete CSS file
var uncompiledCssPath = "../css/";          //Root folder for the less folder
var output = "styleguide.html";          //output file
var cssCompiler = "less";                  //CSS compiler

var hasConfig = fs.existsSync(configfile);
if(hasConfig){
    var readData = fs.readFileSync(configfile);
    var myConfig = JSON.parse(readData);

    if(myConfig.compiledCssPath) compiledCssPath = myConfig.compiledCssPath;
    if(myConfig.uncompiledCssPath) uncompiledCssPath = myConfig.uncompiledCssPath;
    if(myConfig.output) output = myConfig.output;
    if(myConfig.cssCompiler) cssCompiler = myConfig.cssCompiler;

    runProcess();
}
else{

    //PROMPT HERE!
    var step = 0;
    var steps = ["Path to the compiled CSS file", "Path to root folder of uncompiled CSS", "output file name", "css compiler: less, sass or stylus"];
    var stepVal = [compiledCssPath, uncompiledCssPath, output, cssCompiler];

    console.log(steps[0]+" Default:"+stepVal[step]);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', function (text) {
        var pass = true;
        switch(step){
            case 0: pass = validateCompiledCssPath(text); break;
            case 1: pass = validateUncompiledCssPath(text); break;
            case 2: pass = validateOutput(text); break;
            case 3: pass = validateCssCompiler(text); break;
            default: pass = false; break;
        }
        
        if(pass){
            step ++;
            if(step >= steps.length){
                completeInput();
            }
            else{
                console.log(steps[step]+" Default: "+stepVal[step]);
            }
        }
    });

    function validateCompiledCssPath(text) {
        var pass = true;
        text = text.replace("\r\n", "").replace("\n","").trim();
        if(text.length > 0){
            if(text.indexOf(".css", text.length - 4) === -1){
                text = text+".css";
            }
            compiledCssPath = text;
        }
        console.log("Compiled CSS file set to: "+compiledCssPath);
        return pass;
    }
    function validateUncompiledCssPath(text) {
        var pass = true;
        text = text.replace("\r\n", "").replace("\n","").trim();
        if(text.length > 0){
            if(text.indexOf("/", text.length - 1) === -1){
                text = text+"/";
            }
            uncompiledCssPath = text;
        }
        console.log("Uncompiled folder set to: "+uncompiledCssPath);
        return pass;
    }
    function validateOutput(text) {
        var pass = true;
        text = text.replace("\r\n", "").replace("\n","").trim();
        if(text.length > 0){
            if(text.indexOf(".html", text.length - 5) === -1){
                text = text+".html";
            }
            output = text;
        }
        console.log("Output file set to: "+output);
        return pass;
    }
    function validateCssCompiler(text) {
        var pass = true;

        text = text.replace("\r\n", "").replace("\n","").trim();
        if(text.length > 0){
            if(text.toLowerCase() === "less"){
                cssCompiler = "less";
            }
            else if(text.toLowerCase() === "sass"){
                cssCompiler = "sass";
            }
            else if(text.toLowerCase() === "stylus"){
                cssCompiler = "stylus";
            }
            else{
                console.log("Unsupported compiler, we only support less, sass or stylus!");
                pass = false;
            }
        }
        if(pass) console.log("Compiler set to: "+cssCompiler);
        return pass;
    }
    function completeInput() {
        process.stdin.pause();

        var writeData = JSON.stringify({
            compiledCssPath:compiledCssPath,
            uncompiledCssPath:uncompiledCssPath,
            output:output,
            cssCompiler:cssCompiler
        });

        fs.writeFile(configfile, writeData, function (err) {
            if (err) {
                console.log('There has been an error saving your configuration data.');
                console.log(err.message);
                return;
            }
            else{
                console.log("Config Saved");
                runProcess();
            }
        });

    }

    
}


function runProcess(){
    console.log("start process");

    var header = '<!DOCTYPE html><head><meta charset="utf-8">\n<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">\n<title>Styleguide</title>\n<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">\n<link href="'+compiledCssPath+'" rel="stylesheet" type="text/css">\n<link rel="stylesheet" href="css/styleguide.css">\n<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">\n<link href="http://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet" type="text/css">\n</head>\n<body id="idean-styleguide" class="idean-styleguide-body">\n';
    var footer = '<div class="idean-styleguide-popup" style="display:none;"><a href="#" class="idean-styleguide-popup-close">Close</a><div class="idean-styleguide-popup-code"></div></div><footer class="idean-styleguide-footer"><a href="http://www.idean.com" class="idean-styleguide-branding">Idean</a></footer>\n<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js"></script>\n<script>window.jQuery || document.write(\'<script src="js/jquery-1.11.0.min.js"><\\/script>\')</script>\n<script src="js/script.js"></script>\n</body></html>';

    var content = compile(cssCompiler);

    console.log("outputting styleguide");
    fs.writeFileSync("styleguide.html", header + content + footer);
    console.log("styleguide complete");
}
