import React, { useState, useEffect } from 'react'

export const Header = () => {
  // Exclude nav items if they contain a forbidden word
  const navItemsToExclude = ['TEMPLATE', 'Welkom!', 'DRAFT']
  const [folderDocs, setFolderDocs] = useState([])
  const [isNavOpen, setNavMode] = useState(false)

  // Sort array on sub key
  const sortAlphabetically = (elements, key) => {
    return elements.sort((a, b) => {
      return a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1
    })
  }

  const isLinkActive = (id) => window.location.pathname.includes(id)

  useEffect(() => {
    Meteor.call('drive.getFolderFiles', '148bWv4FCGEeTBeEgwZCFjT7gn748s3vj', (err, res) => {
      setFolderDocs(sortAlphabetically(res, 'name'))
    })
  }, [])

  toggleNav = () => {
    setNavMode((isNavOpen) => !isNavOpen)
    document.documentElement.classList.toggle('Nav--toggled')
  }

  closeNav = () => {
    setNavMode(false)
    document.documentElement.classList.remove('Nav--toggled')
  }

  return (
    <header className='Header'>
      <div className='Header__inner'>
        <button
          className='Toggler'
          aria-controls='a11y-main-menu-collapse'
          aria-expanded={isNavOpen}
          onClick={() => toggleNav()}
        >
          <span className='Toggler__label'>Menu</span>
          <span aria-hidden='true' />
          <span aria-hidden='true' />
          <span aria-hidden='true' />
          <span aria-hidden='true' />
        </button>

        <a className='Header__logo' href='#'>
          <img className='Header__image' src='/images/logo-nijverhoek.png' width='290' height='80' />
        </a>

        <nav className='Header__nav Nav--header' id='a11y-main-menu-collapse' aria-hidden={!isNavOpen}>
          <ul className='Nav__items'>
            {folderDocs &&
              folderDocs.map((x) => {
                const navTitleContainsForbiddenWord =
                  navItemsToExclude.filter((forbiddenWord) => x.name.indexOf(forbiddenWord) > -1).length >= 1
                if (navTitleContainsForbiddenWord) return
                return (
                  <li key={x.id} className='Nav__item'>
                    <a
                      href='#'
                      target='_self'
                      className={`Nav__link${isLinkActive(x.id) ? ' Nav__link--active' : ''} `}
                      onClick={(e) => {
                        e.preventDefault()
                        closeNav()
                        FlowRouter.go('/d/' + x.id)
                      }}
                    >
                      <span className='Nav__label'>{x.name}</span>
                      <svg className='Nav__icon' width='10px' height='10px' aria-hidden='true'>
                        <use xlinkHref='#icon--chevron' />
                      </svg>
                    </a>
                  </li>
                )
              })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
