import Future from 'fibers/future';
const {google} = require('googleapis');

async function getFiles(auth, folderId) {
  let fut = new Future();

  const drive = google.drive({version: 'v3', auth});

  (async () => {
    drive.files.list({
      q: 'parents in "'+folderId+'"',
      pageSize: 10,
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
