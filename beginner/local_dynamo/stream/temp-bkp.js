import { createScanStream } from "dynamo-streams"
import AWS from "aws-sdk"

AWS.config.update({
  region: "us-west-2",
  endpoint: "http://localhost:8001"
})

/**
 * Read today
 * - on data:
 *   Find Yesterday
 *   - on data
 run diff function
 *        delete yesterday
 *        save today
 *   - on end
 end writer stream
 */

import { createScanStream } from "dynamo-streams"
import { DynamoDB } from "aws-sdk"
import { concat, isEmpty, isNil } from "ramda"
import { PassThrough } from "stream"

import processSearchAlerts from "./processSearchAlerts"
import {
  fetchYesterday,
  updateYesterday
} from "./components/dbActions/yesterday"

import Writer from "features/streamtoS3"
import fileName from "components/fileName"
import getTableName from "../utils"
import { injectActionDate } from "./injectData"

const { DBS_MKT_SEARCH_ALERT } = process.env
const file = fileName("Search Alerts")

const dataToJS = data =>
  Object.entries(data).reduce(
    (a, [k, v]) => ({
      ...a,
      [k]: ~["alerts", "enableAlerts"].indexOf(k) ? JSON.parse(v) : v
    }),
    {}
  )

const defaultAlertsKeys = [
  "dateCreated",
  "alertId",
  "createdDate",
  "criteria.listingType",
  "criteria.minPrice",
  "criteria.maxPrice",
  "criteria.numberOfBedrooms",
  "criteria.propertyType",
  "criteria.minSize",
  "criteria.maxSize",
  "criteria.sqUnit",
  "criteria.numberOfBathrooms",
  "criteria.furnishing",
  "criteria.district",
  "criteria.mrt",
  "criteria.school",
  "criteria.coordinates",
  "criteria.locLabel",
  "criteria.loc",
  "criteria.alertName",
  "action",
  "sysgenId",
  "alertType",
  "enableAlerts",
  "actionDate"
]

export default function() {
  let alerts = []
  let awaiting = false
  let interval = null
  let writer = null
  let pass = null

  const instantiate = keys => {
    pass = new PassThrough({ objectMode: true })
    writer = new Writer(file, { keys, unwind: ["criteria"] }, true)

    pass.pipe(writer, {
      end: false
    })
  }

  getTableName(DBS_MKT_SEARCH_ALERT).then(returnedTableName => {
    const getAlertsToday = createScanStream(
      new DynamoDB({ region: "ap-southeast-1" }),
      {
        TableName: returnedTableName
      }
    )

    if (!writer) {
      instantiate(defaultAlertsKeys)
    }

    getAlertsToday.on("data", async data => {
      console.log("DATA CALLED FOR ALERTS")
      getAlertsToday.pause()
      const today = dataToJS(data)

      if (!today) {
        console.log("###########################################")
        console.log("Error while fetching today's alerts")
        console.log({ err: data })
        console.log("###########################################")
        return
      }
      try {
        awaiting = true
        const yesterday = await fetchYesterday("searchAlerts", today)
        console.log("AWAITED YESTERDAY FOR ALERTS")
        console.log("[", today.sysgenId, "] today -> ", today)
        console.log("[", today.sysgenId, "] yesterday -> ", yesterday)
        const processed = processSearchAlerts(yesterday, today)
        console.log("[", today.sysgenId, "] processed -> ", processed)

        if (!isNil(processed) && !isEmpty(processed)) {
          const newProcessed = processed.map(data => ({
            ...data,
            ...injectActionDate(data.createdDate, data.action)
          }))

          alerts = concat(newProcessed, alerts)
          pass.write(newProcessed)
        }
        if (today.alerts.length) {
          console.log("[", today.sysgenId, "] updateYesterday")
        } else {
          console.log("[", today.sysgenId, "] resume")
        }
        return (
          today.alerts.length
            ? updateYesterday("searchAlerts", today, error => {
                if (error) {
                  console.log("#######################################")
                  console.log("Error while saving yesterday's alerts")
                  console.log({ err: error.message })
                  console.log("#######################################")
                }
                console.log("RESUMING ALERT STREAM")
                awaiting = false
                return getAlertsToday.resume()
              })
            : (awaiting = false),
          getAlertsToday.resume()
        )
      } catch (e) {
        console.log("#######################################")
        console.log("Error while fetching yesterday's alerts")
        console.log({ err: e.message, today })
        console.log("#######################################")
      }
    })
    const endStream = () => {
      console.log("END CALLED")
      if (awaiting) {
        if (!interval) {
          console.log("STILL AWAITING")
          interval = setInterval(endStream, 1e3)
        }
        return interval
      }
      clearInterval(interval)
      console.log(`Processed ${alerts.length} customers`)
      if (writer) {
        pass.end()
        writer.end()
      }
    }

    getAlertsToday.on("end", endStream)
  })
}
