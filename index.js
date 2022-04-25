const core = require('@actions/core')
const App = require('@octokit/app').App

const getAuthOptions = (permissions) => {
    // For default permissions, do not pass a value and let the issuer decide.
    if (permissions == 'default') {
        return {type: 'installation'}
    }

    // Read the input as a JSON string, make sure that it's an object
    const payload = JSON.parse(permissions)
    if (!payload || Array.isArray(payload) || Object.keys(payload).length == 0) {
        throw "Value of permissions must be 'default' or a JSON payload of required permissions"
    }

    return {
        type: 'installation',
        permissions: payload
    }
}

const main = async () => {
    try {
        // Read the inputs of the action
        const appId = core.getInput('app_id', { required: true })
        const installationId = core.getInput('installation_id', { required: true })
        const privateKey = core.getInput('private_key', { required: true })
        const permissions = core.getInput('permissions', { required: true })

        // Create the App
        core.info(`Creating app ${appId}`)
        const app = new App({
            appId: appId,
            privateKey: privateKey
        })

        // Create a token for the given installationId
        core.info(`Creating access token for installation ${installationId}`)
        const octokit = await app.getInstallationOctokit(installationId)
        const options = getAuthOptions(permissions)
        const auth = await octokit.auth(options)
        const grantedPermissions = JSON.stringify(auth.permissions)

        // Mask the token and set the output
        core.setSecret(auth.token)
        core.setOutput('token', auth.token)
        core.setOutput('permissions', grantedPermissions)
        core.info(`Token granted with permissions: ${grantedPermissions}`)
    } catch (error) {
        core.setFailed(error)
    }
}

main()
