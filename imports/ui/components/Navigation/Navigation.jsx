import React, { useState, useEffect } from 'react';

import './Navigation.css';

export const Navigation = () => {
  const [folderDocs, setFolderDocs] = useState([]);

  useEffect(() => {
    Meteor.call('drive.getFolderFiles', '148bWv4FCGEeTBeEgwZCFjT7gn748s3vj', (err, res) => {
      setFolderDocs(res);
    });
  }, []);

  return (
    <div className="Navigation">
      {folderDocs && folderDocs.map(x => {
        return <a href="#" key={x.id} onClick={(e) => {
          e.preventDefault();
          FlowRouter.go('/d/' + x.id);
        }} className="
          block
          my-4
          bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded
          no-underline
        ">
          {x.name}
        </a>
      })}
    </div>
  );
};
