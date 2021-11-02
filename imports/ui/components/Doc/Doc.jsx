import React, { useState } from 'react';
import { marked } from 'marked';

export const Doc = (props) => {

  // Strip comments from doc
  const strippedDoc = props.doc ? props.doc.split('---')[2] : props.doc;

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
        {props.title}
      </h2>

      <div dangerouslySetInnerHTML={{
        __html: marked(strippedDoc, {breaks: true})
      }} />
    </div>
  );
};
