
const ibiosimFallback = "http://localhost:4000"
const applicationUrlFallback = "http://host.docker.internal:7071"
const systemKeyFallback = ""

module.exports = async function (context) {

    // dynamic import b/c node-fetch is ESM only
    const { default: fetch } = await import("node-fetch")

    // grab our input data
    const { operation, data, contentTypeHeader } = context.bindings.input

    // attach callback to request
    const callbackUrl = `${process.env.APPLICATION_URL || applicationUrlFallback}/runtime/webhooks/durabletask/instances/${context.bindingData.instanceId}/raiseEvent/{event}?code=${process.env.SYSTEM_KEY || systemKeyFallback}`
    const fixedData = addToFormData(data, {
        callback: callbackUrl,
        json: true,
    })

    // execute request
    const response = await fetch(
        `${process.env.IBIOSIM_API || ibiosimFallback}/async/${operation}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': contentTypeHeader,
            },
            body: Buffer.from(fixedData)
        }
    )

    return {
        status: response.status
    }
}


function addToFormData(data, pairsToAdd) {

    const asString = Buffer.from(data).toString()
    const boundary = asString.match(/-{10,}[\S]+/)?.[0]

    return Object.entries(pairsToAdd).reduce((accum, [key, value]) =>
        `${boundary}\r
Content-Disposition: form-data; name="${key}"\r
\r
${value}\r
${accum}`
        , asString)
}