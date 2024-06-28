const { app } = require('@azure/functions');
const df = require('durable-functions');

app.http('HttpTrigger', {
    authLevel: "anonymous",
    methods: ['POST'],
    route: 'orchestrators/{opName}',
    extraInputs: [df.input.durableClient()],
    handler: async (request, context) => {
        const client = df.getClient(context);
        const body = await request.arrayBuffer();

        const opName = request.params.opName
        const header = request.headers.get('content-type')
        const convertBody = Buffer.from(body) // body is initially an object with the array buffer. Just want array
        const input = {
            data: convertBody,
            opName,
            header
        }
        

        const instanceId = await client.startNew("Orchestrator", {input: input});

        context.log(`Started orchestration with ID = '${instanceId}'.`);

        return client.createCheckStatusResponse(request, instanceId);
    },
});