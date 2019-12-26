#!/usr/bin/env bash
vuepress build docs
cd docs/.vuepress/dist
echo 'docs.unitecms.io' > CNAME
