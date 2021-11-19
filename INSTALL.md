# gdocs-site: INSTALL

= [ [README](./README.md) ] . [ **[INSTALL](./INSTALL.md)** ]  . [ [RUN](./RUN.md) ] . [ [CONTRIBUTE](./CONTRIBUTE.md) ] =

## 1. Install dependencies

1. Make sure you have [git](https://git-scm.com/download/mac) installed
1. Make sure you have [Node.js 8+](https://nodejs.org/en/) installed
3. [Install Meteor](https://www.meteor.com/developers/install)

## 2. Clone this repository

1. Open your terminal
2. `git clone git@github.com:bartwr/gdocs-site.git`
3. `cd gdocs-site`

## 3. Get Google API credentials:

For getting Google APP credentials you have two options:

1. Ask [Bart](https://www.bartroorda.nl/contact)
2. Follow the guide below

One is the quickest option. Option two is optional and documented below.

### Getting Google API credentials

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
2. Click the link that appears in your browser<br />
![img](https://i.imgur.com/ieF36AH.png)
3. Follow the steps. You'll get a code in the end
4. Paste the code back into the terminal
5. See the contents of `lib/tools/createCredentials/token.js` for your token

PS If you want to see the app permissions you have given, see https://myaccount.google.com/permissions?pli=1

PPS If you want to create a new token, first delete token.json, then run step 1 (`node index.js`) again

## 4. Set ENV variables

To use this app, we have to configure some variables:

### Any OS

1. Make a copy of .envrc.example and give it filename: `.envrc`
2. Set the variables in the file named `.envrc`

### MacOS

3. Install [HomeBrew](https://brew.sh/):

```/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"```

4. Install [direnv](https://direnv.net/):

```brew install direnv```

5. Navigate to your project folder:

```cd /path/to/gdocs-site```

6. In this 'gdocs-site' folder, activate the variables like this:

```direnv allow```

### Linux

3. Install [direnv](https://direnv.net/)

____

Now you have everything ready to run the app. Go to [RUN](./RUN.md) to see instructions on running the app.
