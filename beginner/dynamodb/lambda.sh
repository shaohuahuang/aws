#!/usr/bin/env bash

zip function.zip index.js
if [[ $1 = 'create' ]]; then
    aws lambda create-function --function-name ProcessDynamoDBRecords \
    --zip-file fileb://function.zip --handler index.handler --runtime nodejs8.10 \
    --role arn:aws:iam::977462991389:role/lambda-dynamodb-role
fi

if [[ $1 = 'update' ]]; then
    aws lambda update-function-code --function-name ProcessDynamoDBRecords \
    --zip-file fileb://function.zip
fi


if [[ $1 = 'invoke' ]]; then
    aws lambda invoke --function-name ProcessDynamoDBRecords --payload file://input.txt outputfile.txt
fi
