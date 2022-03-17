import Future from 'fibers/future';
const {google} = require('googleapis');

async function getFiles(auth) {
  let fut = new Future();

  const drive = google.drive({version: 'v3', auth});
  const folderId = process.env.DRIVE__FOLDER_ID;

  (async () => {
    // Docs: https://developers.google.com/drive/api/v3/reference/files/list
    drive.files.list({
      q: 'parents in "'+folderId+'"',
      corpora: 'drive',
      driveId: process.env.DRIVE__SHARED_DRIVE_ID,
      supportsAllDrives: true,
      includeItemsFromAllDrives: true,
      pageSize: 50,
      fields: 'nextPageToken, files(id, name, webViewLink)',
    }, (err, res) => {
      if (err) return fut.throw(err);

      const files = res.data.files;
      if (files.length) {
        console.log('Files:');
        files.map((file) => {
          console.log(`${file.name} ${file.webViewLink}`);
        });
        fut.return(files);
      }

      else {
        fut.throw('No files found');
      }
    })
  })();

  return fut.wait();
}

export {
  getFiles
}
