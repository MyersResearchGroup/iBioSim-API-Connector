
module.exports = async function (context) {

    // dynamic import b/c node-fetch is ESM only
    const { default: fetch } = await import("node-fetch")

    // grab our input data
    const { operation, data, contentTypeHeader } = context.bindings.input

    // execute request
    const response = await fetch(
        `https://ibiosim-api.wittyfield-d51873c4.westus.azurecontainerapps.io/sync/${operation}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': contentTypeHeader
            },
            body: Buffer.from(data)
        }
    )

    // Convert to a regular array of bytes so DF can handle it
    const responseData = Array.from(
        new Uint8Array(await response.arrayBuffer())
    )

    return {
        data: responseData,
        status: response.status
    }
}