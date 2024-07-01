const df = require('durable-functions');
const unzipper = require('unzipper')
const { Readable } = require('stream')

df.app.activity("Decompressor", {
    handler: async (input) =>{

        const { data } = input
        
        // Unzip data and read out each file
        const responseData = {}
        const zip = Readable.from(Buffer.from(data)).pipe(unzipper.Parse({ forceStream: true }))
        for await (const entry of zip) {
            responseData[entry.path] = await streamToString(entry)
        }
        
        return {
            data: responseData
        }
    }
}) 

function streamToString(stream) {
const chunks = []
return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on('error', (err) => reject(err))
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
})
}