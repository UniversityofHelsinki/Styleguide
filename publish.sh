#!/bin/bash -xe
git checkout develop
echo "## Rebasing develop from origin develop"
git pull --rebase
git checkout gh-pages
git reset --hard develop
echo "## Installing npm dependencies"
npm install
echo "## Installing bower dependencies"
bower install
cp .gitignore_gh-pages .gitignore
echo "## Building styleguide"
./node_modules/gulp/bin/gulp.js
git add .
git commit -m "Github pages updated"
echo "## Pushing updated styleguide"
git push --force origin gh-pages
git checkout develop
echo "## Styleguide: http://universityofhelsinki.github.io/Styleguide"