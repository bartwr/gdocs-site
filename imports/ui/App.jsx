import React, { useState, useEffect } from 'react';

import { Navigation } from './components/Navigation/Navigation.jsx';
import { Doc } from './components/Doc/Doc.jsx';

// Load global App styles
import './App.css';

export const App = (props) => {
  return <div className="App">
    <div className="flex justify-between flex-wrap sm:flex-nowrap">
      <div className="mr-4">
        <Navigation />
      </div>
      <div className="w-full ml-4">
        {props.children}
      </div>
    </div>
    <div className="fixed bottom-0 right-0 pb-1 pr-1">
      <small><a href="https://github.com/bartwr/gdocs-site" target="_blank" className="text-gray-500" rel="external">
        open source
      </a></small>
    </div>
  </div>
}
