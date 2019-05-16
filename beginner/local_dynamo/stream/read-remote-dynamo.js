import { createScanStream } from "dynamo-streams"
import { DynamoDB } from "aws-sdk"

const getAlerts = createScanStream(
  new DynamoDB({
    accessKeyId: "AKIA6HFKVTIO7AP6ND6W",
    secretAccessKey: "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",
    region: "ap-southeast-1"
  }),
  {
    TableName: "employee"
  }
)

getAlerts.on("data", data => {
  console.log(data)
  console.log("======")
})
