const unzipper = require('unzipper')

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

    // Unzip response and send contents as strings
    const responseData = {}
    const zip = response.body.pipe(unzipper.Parse({ forceStream: true }))
    for await (const entry of zip) {
        responseData[entry.path] = await streamToString(entry)
    }

    return {
        data: responseData,
        status: response.status
    }
}


function streamToString(stream) {
    const chunks = []
    return new Promise((resolve, reject) => {
        stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
        stream.on('error', (err) => reject(err))
        stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    })
}