#!/bin/bash

PACKAGE_FOLDER=$1
echo "[$(date +"%d-%m-%Y %r")] Starting collect of data.";
node --no-warnings "$PACKAGE_FOLDER/src/index.js"
echo "[$(date +"%d-%m-%Y %r")] Data collection finished.";
