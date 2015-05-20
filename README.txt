Idean Styleguide V2
-------------------

The Idean Living Styleguide is back, and better than ever!
Now featuring less fuss and more awesomeness, mark comments in your stylesheet to notify the builder of composition of the guide, with references to external templates.

Setup
=====

download the git repo to a subfolder of your project.
run: node build
follow instructions!

compiledCssPath: The relative path to the compiled css file
uncompiledCssPath: The relative path to the uncompiled css files (.less, .sass etc). This should be the Root folder, it will walk all subtrees.
output: The name of the stylesheet page, default stylesheet.html
cssCompiler: The name of the css compiler so we know what files to look for (less, sass, stylus)

Comment syntax:
===============

Write comments anywhere in the document, but I suggest putting it somewhere that is actually relevant to the code you are displaying.
Options:
section: numerical section number with point devision for hierarchy eg 1.1.1
title: name of section (optional)
description: description of section (optional)
template: name of the template html in the template subdirectory with examples to import (optional)
color-list: Display the colors used in the style guideline. Options: grid | list (optional)
colors: Display only a specific set of colors by writing in the variable color name. The list should be comma-separated. (optional)

The hierarchy is imported and created ad hock, so if you only have 1.1.1 then section 1 and 1.1 will automatically be made with no title and description etc.
Recommended structure would have each "page" as the sass section or document with comments in the head, eg.

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
}

/*
section: 2
title: Colors
color-list: grid
*/
~~~

Displaying colors:
==================

By using the comment 

For more information, input or changes either push them here or contact andrew.longstaff@idean.com