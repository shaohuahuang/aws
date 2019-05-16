import { createScanStream } from "dynamo-streams"
import AWS, { DynamoDB } from "aws-sdk"

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8001"
})

const getAlerts = createScanStream(
  new DynamoDB({
    region: "us-west-2",
    endpoint: "http://localhost:8001"
  }),
  {
    TableName: "Movies"
  }
)

getAlerts.on("data", data => {
  console.log(data)
  console.log("======")
})
