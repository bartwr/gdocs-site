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

export {
  findGoogleLinks,
  updateGoogleLinksToLocalLinks
}
