#!/bin/bash
pandoc README.md -t asciidoctor -o README.adoc
asciidoctor README.adoc
mv README.html index.html
