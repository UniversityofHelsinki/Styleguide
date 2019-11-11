# University of Helsinki Style Guide #

## Implementing the style guide in a project ##

There’s a couple of ways on how to implement the style guide, while we don't enforce a specific way, we recommend you implement it in such a fashion that it can easily be updated (i.e. don't copy the files into a new project).

### Using Bower ###

You can configure the style guide as a dependency through bower, which means the style guide will be fetched from github when the project is being initialized.

Here's an example bower.json file (you'll need to change out the hash-string "release-X.X.X" to the release tag you want to use):
```
{
  "name": "my-project",
  [...]
  "devDependencies": {
    "Styleguide": "https://github.com/UH-StudentServices/Styleguide.git#release-X.X.X"
  }
}
```
Depending on how you use the styleguide, you can either have it as a dev dependency or a dependency (i.e. if you're  referencing the .sass files or using the compiled `main.css`).

Once you run `bower install` you should be able to use the style guide from your bower components folder.

### Using git submodules ###

You can add the styleguide, or this repo, as a [git submodule](http://git-scm.com/docs/git-submodule) in your project. The advantage that you get from using submodules is that there are less tools in the chain and you might have an easier time making pull request to the styleguide (depending on your specific workflow).

Here's how you'd add the submodule. (you'll need to change out the "release-X.X.X" to the release tag you want to use)
````
git clone https://github.com/UH-StudentServices/Styleguide.git hu-styleguide
cd hu-styleguide/
git checkout release-X.X.X
````

Once you've added the submodule, you'll have to commit it to the parent repository.

## Additions/changes to the style guide ##

When adding new components or changing existing components, try to do so in a non-breaking fashion (because there might be other projects that depend on the component you’ve changed). Use modifiers for changes and keep to the same standard that the rest of the CSS was written in the specific component.

In some cases the changes that you want to make might be very project specific, and so they might not be relevant for the style guide. You’ll need to ask yourself if the changes will be reusable for other projects besides your own.

If you want to add a new component, keep in mind that the component should be usable outside of the technology decisions that you’ve made, and a third party should be able to implement the same component with the example that you provide in the template. For example in an AngularJs project, you’ll need to strip out all AngularJs specific attributes. This would make the solution both easier to understand as well as more portable code.

Since the style guide does not support any javascript dependencies, you need to document each state a component can have, this makes it easy to see how the component works, and it also makes it easy to test for different screen sizes.

Submit changes with pull requests.

## Usage ##

### Dependencies ###

1. node (version <= 8.4.0) & npm 
2. gulp

### Setting up ###

1. `npm install`
2. `npm start` (to compile the css and launch server)

## Style guide documentation: ##

Read `styleguide/README.md` for more information about how to document the style guide.

## Style guide visual verification
When changing existing components or general styles it is important to make the changes so that some other component is not changed unintentionally. We have some tooling in place in style guide that make this task easier. The basic idea is that each component is rendered to a raster image. Those images can then be compared visually. A visual testing tool called [Hermione](https://github.com/gemini-testing/hermione) is used to inspect and report the changes. 

Git contains a baseline set of rendered component images in directory [hermione/screens](hermione/screens). The new reference images are committed to git together with the changes to the component. This way the reviewer of the pr can immediately see all the changes visually too.

#### Prerequisites ####
1. Styleguide server is running, see [Setting up](#setting-up)
1. Docker

#### Start Visual testing test infra ###
It is important to have a consistent rendering of the components and therefore we use Chrome on Linux to render the components into a raster image. The linux rendering engine runs on docker. 

`npm run visual-testing-infra`

#### Start Visual testing gui ####
Hermione has a gui that can then be used to see and accept the changed raster images while developing the new component.

`npm run visual-testing-gui`

#### Running visual tests from cli ####

`npm test`
