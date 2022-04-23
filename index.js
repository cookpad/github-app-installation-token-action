const core = require('@actions/core')
const App = require('@octokit/app').App

const main = async () => {
    try {
        // Read the inputs of the action
        const appId = core.getInput('app_id', { required: true })
        const installationId = core.getInput('installation_id', { required: true })
        const privateKey = core.getInput('private_key', { required: true })

        // Create the App
        core.info(`Creating app ${appId}`)
        const app = new App({
            appId: appId,
            privateKey: privateKey
        })

        // Mint a token for the given installationId
        core.info(`Minting access token for installation ${installationId}`)
        const octokit = await app.getInstallationOctokit(installationId)
        const { token } = await octokit.auth({ type: 'installation' })

        // Mask the token and set the output
        core.setSecret(token)
        core.setOutput('token', token)
        core.info('Token generated successfully')

    } catch (error) {
      core.setFailed(error.message)
    }
  }

// Call the main function to run the action
main();
