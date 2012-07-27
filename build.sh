#! /bin/sh
haml bundle/index.haml bundle/index.html
node_modules/.bin/coffee -c bundle/
