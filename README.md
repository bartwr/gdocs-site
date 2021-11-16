# gdocs-site

## Prerequisites

- Make sure you have [Node.js 8+](https://nodejs.org/en/) installed
- [Install Meteor](https://www.meteor.com/developers/install)

## Getting Google API credentials

Follow these steps to get your token:

## Getting Google API credentials

To run this app, you need to create **API credentials** and an **API token**.

WARNING: Don't create API credentials that can access your full Google Drive. If you do, all your files could be exposed.

Follow these steps to get API credentials:

1. [Create a GMail user](https://accounts.google.com/signup/v2/webcreateaccount?service=mail&continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&dsh=S-435792339%3A1636063525625575&biz=false&flowName=GlifWebSignIn&flowEntry=SignUp)
2. In Google Drive, share one specific folder with the GMail address created in step 1. In example, share the folder "Nijverhoek kennisbank"
3. Create authorization credentials for a desktop application. To learn how to create credentials for a desktop application, refer to [Create credentials](https://developers.google.com/workspace/guides/create-credentials)
5. Download the JSON file to get your `credentials.json`

Follow these steps to enable the Google Drive/Docs API:

1. Enable the [Google Drive API](https://console.cloud.google.com/apis/library/drive.googleapis.com?project=nijverhoek-kennisbank)
2. Enable the [Google Docs API](https://console.cloud.google.com/apis/library/docs.googleapis.com?project=nijverhoek-kennisbank)

Follow these steps to get your token:

1. Run `cd lib/tools/createCredentials && node index.js`
2. Click the link that appears in your browser
![img](https://i.imgur.com/ieF36AH.png)
3. Follow the steps. You'll get a code in the end
4. Paste the code back into the terminal
5. See the contents of `lib/tools/createCredentials/token.js` for your token

PS If you want to see the app permissions you have given, see https://myaccount.google.com/permissions?pli=1

PPS If you want to create a new token, first delete token.json, then run step 1 (`node index.js`) again

## Set ENV variables

The following ENV variables have to be set.

    CREDENTIALS__CLIENT_ID
    CREDENTIALS__PROJECT_ID
    CREDENTIALS__CLIENT_SECRET

    TOKEN__ACCESS_TOKEN
    TOKEN__REFRESH_TOKEN
    TOKEN__SCOPE

Set these variables in a file named `.envrc`.

Load these variables, in example by using [direnv](https://direnv.net/#getting-started): `direnv allow`.

## Running the app

    npm run start

## Documentation

- Documentation on using Google's API: [api/quickstart/nodejs](https://developers.google.com/docs/api/quickstart/nodejs)
