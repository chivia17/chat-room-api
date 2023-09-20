#!/bin/bash
SCRIPT_NAME=$1
mongo --host "mongodb://$MONGO_INITDB_ROOT_USERNAME:$MONGO_INITDB_ROOT_PASSWORD@localhost:27017" "/user/local/scripts/mongo/$SCRIPT_NAME"
