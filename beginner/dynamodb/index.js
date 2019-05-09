exports.handler = (event, context, callback) => {
    console.log(JSON.stringify(event, null, 2))
    event.Records.forEach(record => {
        console.log(record.eventID)
        console.log(record.eventName)
        console.log("DynamoDB Record: %j", record.dynamodb)
    })
    callback(null, "message")
}
