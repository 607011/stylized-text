#!/bin/bash
DIST=dist/
DEST=cx20:/var/www/ersatzworld.net/html/stylized-text

echo Cleaning up ...
rm -rf $DIST
mkdir $DIST

echo Compressing JavaScript ...
uglifyjs --compress --mangle -o $DIST/app.js -- app.js

echo Compressing HTML ...
html-minifier \
  --collapse-whitespace \
  --remove-comments \
  --remove-optional-tags \
  --remove-script-type-attributes \
  --remove-tag-whitespace \
  --use-short-doctype \
  --minify-css true \
  --minify-js true \
  index.html -o $DIST/index.html

echo Copying other files ...
OTHER_FILES="dropdown.png"
for f in $OTHER_FILES; do
  cp -a $f $DIST
done

echo Deploying to $DEST ...
FILES="$OTHER_FILES index.html app.js"
cd $DIST
rsync -rqtazv $FILES $DEST
