
# iBioSim API Connector

This is a program which connects the [iBioSim REST API](https://github.com/MyersResearchGroup/iBioSim-API) to the [SynBioSuite app](https://github.com/MyersResearchGroup/SynBioSuite), 
allowing for asynchronous command and polling of long-running simulation jobs. 
It takes advantage of [Azure Function's Durable Functions extension](https://learn.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview?tabs=javascript).



## Motivation

The [iBioSim API](https://github.com/MyersResearchGroup/iBioSim-API) and [SynBioSuite app](https://github.com/MyersResearchGroup/SynBioSuite) were both designed to be platform agnostic,
meaning they don't need to run on any specific cloud provider or could be self-hosted.
Furthermore, the iBioSim API was designed to be stateless as to comply with REST standards
and so it could be deployed serverlessly.

However, since SynBioSuite is a purely client-side
application, some sort of stateful backend component was needed to allow for
asynchronous, long-running operations. Thus, the iBioSim API Connector was created.
## API Reference

This API is used similarly to the [iBioSim API](https://github.com/MyersResearchGroup/iBioSim-API#api-reference),
but there's no need to provide a callback URL, as that's appended to incoming requests
interally.
## Run Locally

To run this program locally, you need to use the Azure Functions Emulator. Refer
to ["Prerequisites"](https://learn.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#prerequisites) 
and ["Test the function locally"](https://learn.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#test-the-function-locally)
in the Durable Functions JavaScript starter tutorial.
## Deployment on Azure

For deployment, it's easiest to do so within VSCode. Follow the aforementioned tutorial
from [this point forward](https://learn.microsoft.com/en-us/azure/azure-functions/durable/quickstart-js-vscode#prerequisites).
## Other Platforms / Self-Hosting

Unfortantely, this connector is made specifically for use on Azure, as it uses
platform-specific libraries. You could try using the Functions emulator within
a Docker container, which could then be deployed anywhere that allows containers,
but I have never tested this.

**Note:** if you're going to try this, you'll also need the
[Azure Storage Emulator](https://learn.microsoft.com/en-us/azure/storage/common/storage-use-emulator),
although it is deprecated. In favor of what is unknown.
## Environment Variables

To run this project, you will need to add the following environment variables. At the time
of writing, I could not find a way to include them in a file with the deployment. Instead,
I defined them in the Configuration section in the Function App's Azure portal page.

`APPLICATION_URL` The public URL for the Function App. There is probably a way to find this
dynamically without setting an environment variable, but I don't know how.

`IBIOSIM_API` The public URL for an instance of iBioSim API.