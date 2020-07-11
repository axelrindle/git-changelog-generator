#!/bin/bash

# # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
#
# Bash Script to be run as npm's postversion hook.
#
# The CHANGELOG.md file will be regenerated.
# Changes to this file and the both package files are committed.
#
# Nothing will be pushed to allow for manual review.
#
# # #

VERSION=$(cat package.json | jq -r .version)
echo " >  Temporarily creating new tag ($VERSION) ..."
git tag $VERSION

echo " >  Updating CHANGELOG.md ..."
node ./lib/ --paths res,lib
echo
git add CHANGELOG.md
git commit -m "Update CHANGELOG.md"

echo " >  Committing package files ..."
git add package.json package-lock.json
git commit -m "Version $VERSION :tada:"

echo " >  Forcing an update of the existing tag ..."
git tag -f $VERSION

echo " >  Done."