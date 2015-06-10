Idean Styleguide
================

Idean styleguide is a compact paginated styleguide generator from comments in your CSS.
The generator works by externalising demonstration templates for styleguide examples and categorising and commenting sections from defined key:value pairs in the CSS comments.

Setup
-----

Download the git repo to a subfolder of your project.
To run the compiler run 'node build'
It is reccommended that first run is run manually, and further iterations added to a build script after your CSS compiler is run.

First time
----------

You will be prompted to setup the project with the following:

* compiledCssPath: The relative path to the compiled css file.
* uncompiledCssPath: The relative path to the uncompiled css files (.less, .sass etc). This should be the root folder, it will walk all subtrees.
* output: The output file of the stylesheet page, default stylesheet.html.
* cssCompiler: The name of the css compiler so we know what files to look for (currently supported: less, sass, stylus).
* templatePath: The relative path to the folder containing templates, default templates/.
* styleguideTitle: The title that is prefixed on main headings throughout the styleguide.

A override.css file will be created in the templates folder, you can use this file to write custom or overwrite CSS for the styleguide.

Comment syntax:
---------------

Write comments anywhere in the CSS document, but we suggest putting it somewhere that is actually relevant to the code you are displaying to act as documentation.

Required
* section: numerical section number with point devision for hierarchy eg 1.1.1

Optional:
* title: name of section
* description: description of section
* template: name of the template html in the template subdirectory with examples to import
* color-list: Display the colors used in the style guideline. Options: grid | list
* colors: Display only a specific set of colors by writing in the variable color name. The list should be comma-separated.

The hierarchy is imported and created ad hock, so if you only have 1.1.1 then section 1 and 1.1 will automatically be made with no title and description etc.
Recommended structure would have each "page" as the sass section or document with comments in the head, eg.
If you have duplicate section numbers they will be overwritten by the latest, and a warning printed in the console.

~~~
/*
section: 1
title:Buttons
 */

/*
section: 1.1
title:Basic buttons
 */

/*
section: 1.1.1
title:Button 1
template:button_1
 */
.button1{
	...
}

/*
section: 1.1.2
title:Button 1
template:button_2
 */
.button2{
	...
}

/*
section: 2
title: Colors
color-list: grid
*/
~~~


Templates:
----------

Templates are stored in the subdirectory 'templates'. These should be direct implementations and examples of states of the CSS, either alone or in a container as required.
Firstrun templates are stubbed out for you, so by naming the template and running the script it will automatically create the file for you to then complete.

License:
--------
This styleguide is under the MIT license, see the license.txt for more information.