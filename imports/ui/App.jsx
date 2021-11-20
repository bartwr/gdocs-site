import React, { useState, useEffect } from 'react'

import { Header } from './components/Header/Header.jsx'
import { Doc } from './components/Doc/Doc.jsx'

// Load global App styles
// import '../../wwwroot/css/App.css';

export const App = (props) => {
  return (
    <>
      <Header />
      <main className='main'>{props.children}</main>
      <footer className='footer'>
        <small>
          <a href='https://github.com/bartwr/gdocs-site' target='_blank' className='text-gray-500' rel='external'>
            open source
          </a>
        </small>
      </footer>
      <svg xmlns='https://www.w3.org/2000/svg' style={{ display: 'none' }} aria-hidden='true'>
        <symbol id='icon--chevron' viewBox='0 0 14 14'>
          <path d='M7,11a.99676.99676,0,0,1-.707-.293l-6-6A.99989.99989,0,0,1,1.707,3.293L7,8.58594l5.293-5.293A.99989.99989,0,0,1,13.707,4.707l-6,6A.99676.99676,0,0,1,7,11Z' />
        </symbol>
      </svg>
    </>
  )
}
