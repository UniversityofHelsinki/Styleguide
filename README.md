University of Helsinki Style Guide
==================================

Implementing the style guide in a project
-----------------------------------------

There’s a couple of ways on how to implement the style guide, the recommended way would be to use the style guide as a Git sub-module in the project that wants to implement it. The reason why you would want to use it as a sub-module instead of copying the files is because you’ll be able to get changes and new release from upstream.

Once the sub-module is in place, you can add the relevant SASS files that the project needs to the main SASS file so it’s compiled with the rest of the project’s CSS.

Additions/changes to the style guide
------------------------------------

When adding new components or changing existing components, try to do so in a non-breaking fashion (because there might be other projects that depend on the component you’ve changed). Use modifiers for changes and keep to the same standard that the rest of the CSS was written in the specific component.

In some cases the changes that you want to make might be very project specific, and so they might not be relevant for the style guide. You’ll need to ask yourself if the changes will be reusable for other projects besides your own.

If you want to add a new component, keep in mind that the component should be usable outside of the technology decisions that you’ve made, and a third party should be able to implement the same component with the example that you provide in the template. For example in an AngularJs project, you’ll need to strip out all AngularJs specific attributes. This would make the solution both easier to understand as well as more portable code.

Since the style guide does not support any javascript dependencies, you need to document each state a component can have, this makes it easy to see how the component works, and it also makes it easy to test for different screen sizes.

Submit changes with pull requests.

Setup:
======

1. `bundle install`
2. `npm install`
3. `gulp` (to compile the css)
4. `node build` (to render styleguide.html)

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
