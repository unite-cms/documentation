#!/usr/bin/env bash
vuepress build src/
rm -rf ./docs
mv src/.vuepress/dist/ ./docs