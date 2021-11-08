import { Meteor } from 'meteor/meteor';
import Future from 'fibers/future';

const base = process.env.PWD;
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const docsMarkdown = require("docs-markdown");

import { getFiles } from './drive.js';

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/documents.readonly', 'https://www.googleapis.com/auth/drive.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.

const authorizedCall = async (funcName, args) => {
  // Authorize a client with credentials, then call the Google Docs API.
  const credentials = {
    "installed": {
      "client_id": process.env.CREDENTIALS__CLIENT_ID,
      "project_id": process.env.CREDENTIALS__PROJECT_ID,
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_secret": process.env.CREDENTIALS__CLIENT_SECRET,
      "redirect_uris": [
        "urn:ietf:wg:oauth:2.0:oob",
        "http://localhost"
      ]
    }
  };
  return await authorize(credentials, funcName, args);
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
async function authorize(credentials, callback, args) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );

  // Check if we have previously stored a token.
  const token = {
    "access_token": process.env.TOKEN__ACCESS_TOKEN,
    "refresh_token": process.env.TOKEN__REFRESH_TOKEN,
    "scope": process.env.TOKEN__SCOPE,
    "token_type": "Bearer",
    "expiry_date": 1635899614813
  }
  oAuth2Client.setCredentials(token);
  return await callback(oAuth2Client, args);
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

function formatContent(elements) {
  if(! elements) return;
  elements.map(element => {
    if(! element.textRun || ! element.textRun.content) return;
    console.log(element.textRun.content);
  })
}

/**
 * Prints the title of a sample doc:
 * https://docs.google.com/document/d/195j9eDD3ccgjQRttHhJPymLJUCOUjs-jmwTrekvdjFE/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth 2.0 client.
 */
async function getTitle(auth, documentId) {
  let fut = new Future();
  const docs = google.docs({version: 'v1', auth});

  (async () => {
    docs.documents.get({
      documentId: documentId,
    }, (err, res) => {
      if (err) fut.throw(err);
      fut.return(res.data.title)
    });
  })();

  return fut.wait();
}

// async function getDoc(auth, documentId) {
//   let fut = new Future();
//   const docs = google.docs({version: 'v1', auth});

//   (async () => {
//     docs.documents.get({
//       documentId: documentId,
//     }, (err, res) => {
//       if (err) fut.throw(err);
//       fut.return(res.data ? res.data : 'nope')
//     });
//   })();

//   return fut.wait();
// }

async function getFormattedDoc(auth, documentId) {
  let fut = new Future();
  const docs = google.docs({version: 'v1', auth});

  (async () => {
    docs.documents.get({
      documentId: documentId,
    }, (err, res) => {
      if (err) fut.throw(err);
      const markdown = docsMarkdown.googleDocsToMarkdown(res.data);

      fut.return(markdown)
    });
  })();

  return fut.wait();
}

Meteor.methods({
  'docs.getTitle': async function (documentId) {
    return await authorizedCall(getTitle, documentId);
  },
  // 'docs.getDoc': async function(documentId) {
  //   return await authorizedCall(getDoc, documentId);
  // },
  'docs.getFormattedDoc': async function(documentId) {
    return await authorizedCall(getFormattedDoc, documentId);
  },
  'drive.getFolderFiles': async function(folderId) {
    return await authorizedCall(getFiles, folderId);
  }
})
