from difflib import SequenceMatcher
import sys

with open("canonical_mappings") as f:
    s = f.read().split("\n")

filename = sys.argv[1]

max_score = 0
max_match = ""
for line in s:
    match = SequenceMatcher(None, line, filename).ratio()
    if match > max_score:
        max_score = match
        max_match = line
if max_score > 0.5:
    print(max_match)


