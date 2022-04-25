# GitHub App Installation Token Action

A GitHub Action that can be used to generate scoped credentials for use within your workflow using an App integration.

A Workflow often needs to authenticate and communicate with GitHub, either via API requests or Git operations. The default `GITHUB_TOKEN` environment variable is great if you only need to access public repositories or the one that the workflow is contained within, but if you need to access other private repositories then you have two options:

1. Use a Personal Access Token, which gives access to **all** private repositories that the personal account has access to
2. Use a GitHub App

This action helps you to use a GitHub App, which are able to have a much narrower scope of access (i.e specific repositories). This action is able to mint an access token with a short expiry date that you can then go ahead and use in other steps within your workflow.

The Action provided here is heavily inspired by the result of this article: [Authenticating as a GitHub App in a GitHub Actions workflow](https://dev.to/dtinth/authenticating-as-a-github-app-in-a-github-actions-workflow-27co).

## Usage

```yml
name: My Workflow
on: workflow_dispatch
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Authenticate GitHub
        id: github-auth
        uses: cookpad/github-app-installation-token-action@v1
        with:
          app_id: ${{ secrets.GH_AUTH_APP_ID }}
          private_key: ${{ secrets.GH_AUTH_PRIVATE_KEY }}
          installation_id: ${{ secrets.GH_AUTH_INSTALLATION_ID }}
          permissions: '{"contents": "read"}' # or 'default'

      - name: Checkout Other Repo
        uses: actions/checkout@v3
        with:
          ref: main
          token: ${{ steps.github-auth.outputs.token }}
          repository: my-org/other-private-repo
```
