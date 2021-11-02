import React, { useState, useEffect } from 'react';

import { Navigation } from './components/Navigation/Navigation.jsx';
import { Doc } from './components/Doc/Doc.jsx';

// Load global App styles
import './App.css';

export const App = () => {
  const [title, setTitle] = useState('');
  const [doc, setDoc] = useState('');

  useEffect(() => {
    Meteor.call('docs.getTitle', '1J3gT-_NmdR0Jj5tJl79uUYDBC09siruD5idlmlNwz7Q', (err, res) => {
      setTitle(res);
    });
  }, []);

  useEffect(() => {
    Meteor.call('docs.getFormattedDoc', '1J3gT-_NmdR0Jj5tJl79uUYDBC09siruD5idlmlNwz7Q', (err, docInMarkdown) => {
      setDoc(docInMarkdown);
    });
  }, []);

  return <div>
    <div className="flex justify-between">
      <div className="mr-2">
        <Navigation />
      </div>
      <div className="ml-2">
        <Doc
          title={title}
          doc={doc}
        />
      </div>
    </div>
  </div>
}
