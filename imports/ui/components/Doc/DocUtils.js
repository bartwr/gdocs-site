const findGoogleLinks = (input) => {
  // Examples:
  // - https://docs.google.com/document/u/0/d/1W5Ye92m0v_f6C_1Xc_mnheSIoIXxt4b5BVgh8nYhyWY/edit
  // - https://docs.google.com/document/u/0/d/18JK6LbDiopwY56KPIJa9rPZxCwo8CG_mbhDJD4WeqjU/edit
  const pattern = new RegExp("https:\/\/docs\.google\.com\/document\/u\/0\/d\/([a-zA-Z0-9_]*)\/edit", "g");
  const matches = input.matchAll(pattern);
  let allUrls = [];
  for (const match of matches) {
    allUrls.push({
      url: match[0],
      id: match[1],
      start: match.index,
      end: match.index + match[0].length
    })
  }
  return allUrls;
}

export async function loadImages(imageUrlArray) {
  const promiseArray = []; // create an array for promises
  const imageArray = []; // array for the images

  for (let imageUrl of imageUrlArray) {
    promiseArray.push(new Promise(resolve => {
      const img = new Image();
      img.onload = function() {
        // resolve the promise, indicating that the image has been loaded
        resolve();
      };

      img.src = imageUrl;
      imageArray.push(img);
    }));
  }

  await Promise.all(promiseArray); // wait for all the images to be loaded
  console.log("all images loaded");
  return imageArray;
}

const updateGoogleLinksToLocalLinks = (content, allFolderDocuments) => {
  let updatedContent = content;
  // Find all Google Docs links
  // Links look like this: https://docs.google.com/document/u/0/d/1W5Ye92m0v_f6C_1Xc_mnheSIoIXxt4b5BVgh8nYhyWY/edit
  const allUrls = findGoogleLinks(content)
  const getIdFromDocumentUrl = (url) => {
    if(! url) return url;
    // Get ID from URL
    return url.replace('https://docs.google.com/document/u/0/d/', '').replace('/edit', '')
  }
  const findFolderDoc = (id) => {
    const theDoc = allFolderDocuments.filter(x => {
      return x.id == id;
    })
    return theDoc ? theDoc[0] : false;
  }
  // Check what URLs can be replaced by 'our website' URLs
  allUrls.map(x => {
    // Get document ID based on URL
    let id = getIdFromDocumentUrl(x.url)
    // Check if this doc is in our folder
    let isFolderDoc = findFolderDoc(id);
    // If it's a folder doc, replace the URL into an 'our website' URL
    if(isFolderDoc) {
      updatedContent = content.replace(x.url, `https://kennisbank.nijverhoekrotterdam.nl/d/${id}`)
    }
  });
  return updatedContent;
}

const openExternalLinksInNewTab = () => {
  var all_links = document.querySelectorAll('a');
  for (var i = 0; i < all_links.length; i++){
    var a = all_links[i];
    if(a.hostname != location.hostname) {
      a.rel = 'noopener';
      a.target = '_blank';
    }
  }
}

export {
  findGoogleLinks,
  updateGoogleLinksToLocalLinks,
  openExternalLinksInNewTab
}
