import React, { useState, useEffect } from 'react';

export const Navigation = () => {
  const [folderDocs, setFolderDocs] = useState({});

  useEffect(() => {
    Meteor.call('drive.getFolderFiles', '148bWv4FCGEeTBeEgwZCFjT7gn748s3vj', (err, res) => {
      setFolderDocs(res);
    });
  }, []);

  console.log(folderDocs)

  return (
    <div className="Navigation">
      {folderDocs.map(x => {
        return <a href="#" key={x.name}>
          {x.name}
        </a>
      })}
    </div>
  );
};
