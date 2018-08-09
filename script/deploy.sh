#!/bin/sh

rm -rf dist || exit 0;
if [ "$TRAVIS_BRANCH" = "master" ] && [ "$TRAVIS_PULL_REQUEST" = "false" ]; then
  mkdir dist;
  ( cd dist
    git init
    git config user.name "sarbbottam"
    git config user.email "sarbbottam@gmail.com"
    cp ../example/index.html ./index.html
    cp ../example/main.css ./main.css
    cp ../example/index.js ./index.js
    cp -r ../example/prism ./prism
    cp -r ../example/logo.png ./logo.png
    git add .
    git commit -m "initial commit"
    git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master:gh-pages > /dev/null 2>&1
  )
else
   echo "not publising to gh-pages"
fi
