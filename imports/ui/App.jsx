import React, { useState, useEffect } from 'react'

import { isDesktop } from '/imports/ui/AppUtils'

import { Header } from './components/Header/Header.jsx'
import { Doc } from './components/Doc/Doc.jsx'

export const App = (props) => {
  window.IS_RENDERED = true;

  return (
    <>
      <Header />

      <main className='main'>
        <div className='main__inner container--m gutter--m'>{props.children}</div>
      </main>

      <footer className='footer container--m gutter--m spacing--s text--s text--styled text--center'>
        {new Date().getFullYear()} De Nijverhoek&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href='https://github.com/bartwr/gdocs-site' target='_blank' rel='external' title="Werk mee aan de website; deze site is open source">
          source
        </a>&nbsp;&nbsp;|&nbsp;&nbsp;
        <a href='https://simpleanalytics.com/kennisbank.nijverhoekrotterdam.nl' target='_blank' rel='external' title="Bekijk website-statistieken">
          stats
        </a>
      </footer>

      <svg xmlns='https://www.w3.org/2000/svg' style={{ display: 'none' }} aria-hidden='true'>
        <symbol id='icon--chevron' viewBox='0 0 14 14'>
          <path d='M7,11a.99676.99676,0,0,1-.707-.293l-6-6A.99989.99989,0,0,1,1.707,3.293L7,8.58594l5.293-5.293A.99989.99989,0,0,1,13.707,4.707l-6,6A.99676.99676,0,0,1,7,11Z' />
        </symbol>
      </svg>
    </>
  )
}
