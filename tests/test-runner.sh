#!/usr/bin/bash
# This is important because the tests are run from the main directory
# with npm test.
cd ./tests
# These nodeunit tests are generally unit testing
# individual functionality of trout. They are white box testing
# and know the behaviour of the entire library.
nodeunit whitebox
nodeunitResult=$?
# Blackbox testing with a custom request maker
node test.js
customTestResult=$?
