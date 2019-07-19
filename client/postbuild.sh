#!/bin/bash
parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )

cd "$parent_path"

# clear public folder
# move build dir to public 
# remove build dir
rm -rfv ../public/* && mv  -v ./build/* ../public/ && rmdir ./build