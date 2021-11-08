import React, { useState, useEffect } from 'react';

import './Navigation.css';

export const Navigation = () => {
  const navItemsToExclude = [
    'TEMPLATE',
    'Kennisbank home'
  ];
  const [folderDocs, setFolderDocs] = useState([]);

  // Sort array on sub key
  const sortAlphabetically = (elements, key) => {
    return elements.sort((a, b) => {
      return a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1;
    });
  }

  useEffect(() => {
    Meteor.call('drive.getFolderFiles', '148bWv4FCGEeTBeEgwZCFjT7gn748s3vj', (err, res) => {
      setFolderDocs(
        sortAlphabetically(res, 'name')
      );
    });
  }, []);

  return (
    <div className="Navigation">
      {folderDocs && folderDocs.map(x => {
        if(navItemsToExclude.indexOf(x.name) > -1) return;
        return <a href="#" target="_self" key={x.id} onClick={(e) => {
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
