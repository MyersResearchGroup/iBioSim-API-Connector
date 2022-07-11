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
        return { error: `Received bad status from iBioSim API: ${response.status}` }
    
    return response.data
})