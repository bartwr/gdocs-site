import React, { useState, useEffect } from 'react';

import './Navigation.css';

export const Navigation = () => {
  // Exclude nav items if they contain a forbidden word
  const navItemsToExclude = [
    'TEMPLATE',
    'Welkom!',
    'DRAFT'
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
        const navTitleContainsForbiddenWord = navItemsToExclude.filter(forbiddenWord => x.name.indexOf(forbiddenWord) > -1).length >= 1;
        if(navTitleContainsForbiddenWord) return;
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
