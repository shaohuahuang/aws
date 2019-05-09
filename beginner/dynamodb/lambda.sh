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

if [[ $1 = 'mapping' ]];then
    aws lambda create-event-source-mapping --function-name ProcessDynamoDBRecords \
    --batch-size 100 --starting-position LATEST --event-source arn:aws:dynamodb:ap-southeast-1:977462991389:table/lambda-dynamodb-stream/stream/2019-05-09T12:34:42.680
fi


if [[ $1 = 'delete-mapping' ]];then
    aws lambda delete-event-source-mapping --uuid 542aceb1-0654-4d3c-9a3d-c1eba5e324d9
fi
