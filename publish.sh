#!/bin/bash -xe

###
# Script to publish Styleguide develop version to GitHub pages at http://universityofhelsinki.github.io/Styleguide
# This script is triggered to run on Mystudies Myteachings Jenkins on repository updates http://opi-1.student.helsinki.fi:8082/view/Styleguide/job/styleguide-publish-develop-github-pages/
###
git checkout develop
echo "## Rebasing develop from origin develop"
git pull --rebase
git checkout gh-pages
git reset --hard develop
echo "## Installing npm dependencies"
npm install
cp .gitignore_gh-pages .gitignore
echo "## Building styleguide"
./node_modules/gulp/bin/gulp.js
git add .
git commit -m "Github pages updated"
echo "## Pushing updated styleguide"
git push --force origin gh-pages
git checkout develop
echo "## Styleguide: http://universityofhelsinki.github.io/Styleguide"