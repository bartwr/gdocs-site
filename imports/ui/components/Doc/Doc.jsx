import React, { useState, useEffect } from 'react';
import { marked } from 'marked';

export const Doc = (props) => {
  const [title, setTitle] = useState('');
  const [doc, setDoc] = useState('');

  useEffect(() => {
    setTitle('...');
    Meteor.call('docs.getTitle', props.documentId, (err, res) => {
      setTitle(res);
    });
  }, [props.documentId]);

  useEffect(() => {
    setDoc('...');
    Meteor.call('docs.getFormattedDoc', props.documentId, (err, docInMarkdown) => {
      setDoc(docInMarkdown);
    });
  }, [props.documentId]);

  // Strip comments from doc
  const strippedDoc = (doc && doc.indexOf('---') > -1) ? doc.split('---')[2] : doc;

  return (
    <div>
      <h1 className="
        text-4xl
        font-bold
      ">
        Nijverhoek kennisbank 
      </h1>

      <h2 className="
        text-2xl
        font-bold
      ">
        {title}
        <a href={`https://docs.google.com/document/d/${props.documentId}/edit`} target="_blank" rel="external" title="Bewerk in Google Docs" className="
          inline-block px-2 no-underline
          transition-transform
          duration-200
          transform
          hover:scale-110
        ">
          📝
        </a>
      </h2>

      <div dangerouslySetInnerHTML={{
        __html: marked(strippedDoc, {breaks: true})
      }} />
    </div>
  );
};
