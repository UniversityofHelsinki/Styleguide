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
4. cd into `styleguide/`
5. `node build` (to render `index.html`, the style guide)

Style guide documentation:
---------------

Read `styleguide/README.md` for more information about how to document the style guide.

