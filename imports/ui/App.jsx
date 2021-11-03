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
  </div>
}
