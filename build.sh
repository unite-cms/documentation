#!/usr/bin/env bash
vuepress build src -d docs
cd docs
echo 'docs.unitecms.io' > CNAME
