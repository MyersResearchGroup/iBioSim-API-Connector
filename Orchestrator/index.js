const df = require("durable-functions")


module.exports = df.orchestrator(function* (context) {

    const req = context.df.getInput()

    // hit API running on Container Apps
    const response = yield context.df.callActivity("RunOp", {
        operation: req.params.opName,
        data: req.body.data,
        contentTypeHeader: req.headers['content-type']
    })

    // check for errors in the fetch
    if (response.status >= 400)
        throw new Error(`Received bad status from iBioSim API: ${response.status}\n${response.data}`)

    // wait for either a "complete" or "error" event
    const completeEvent = context.df.waitForExternalEvent("complete")
    const errorEvent = context.df.waitForExternalEvent("error")
    const winner = yield context.df.Task.any([completeEvent, errorEvent])

    // if we got "complete"
    if(winner === completeEvent) {
        // call decompressing activity
        const { data: decompressed } = yield context.df.callActivity("Decompressor", {
            data: winner.result.data,
        })

        return decompressed
    }

    // otherwise received error
    console.error(winner.result)
    throw Error("Received error event.")
})