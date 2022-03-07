#!/bin/bash

source ./credentials.sh prifina-123 eu-west-1
# source ./credentials.sh default eu-west-1

node testing-revert.js
node delete-prifina-session.js 
node testing-init-ddb.js 
pushd ../packages/app-testing

export USERNAME=testing-1
export PASSWORD='********'

export TEST_URL='http://localhost:3000'

# running jest script... 
# node_modules/.bin/jest __tests__/2022-2-11/home.test.js 
node_modules/.bin/jest __tests__/2022-3-4/appMarket.test.js 

popd
