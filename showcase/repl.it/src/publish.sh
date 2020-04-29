#!/bin/bash

set -x

for file in *.md
do
    mdhtml "$file"
done

for file in *.html
do
    ca=$(python3 guess_links.py $file)
    gsed -i "4i<link rel='canonical' href='${ca}'>" $file
done
