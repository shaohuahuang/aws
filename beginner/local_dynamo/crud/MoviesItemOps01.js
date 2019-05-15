var AWS = require("aws-sdk")

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8001"
})

var docClient = new AWS.DynamoDB.DocumentClient()

var table = "Movies"

var year = 2015
var title = "The Big New Movie"

var params = {
  TableName: table,
  Item: {
    year,
    title,
    info: {
      pilot: "Nothing happens at all",
      rating: 1
    }
  }
}

console.log("Adding a new item...")
docClient.put(params, function(err, data) {
  if (err) {
    console.error(
      "Unable to add item. Error JSON:",
      JSON.stringify(err, null, 2)
    )
  } else {
    console.log("Added item:", JSON.stringify(data, null, 2))
  }
})
