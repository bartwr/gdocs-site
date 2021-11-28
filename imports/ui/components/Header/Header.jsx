import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { saveFolderFiles } from '/imports/reducers/folder'

import { isDesktop } from '/imports/ui/AppUtils'

export const Header = () => {
  const dispatch = useDispatch()

  // Get folder from store
  const folderFromStore = useSelector((state) => state.folder)

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

  // Auto hide header on scroll
  const autoHideHeader = () => {
    const header = document.getElementById('Header')

    let lastKnownScrollPosition = 0,
      direction = 0,
      ticking = false

    window.addEventListener('scroll', (e) => {
      direction = lastKnownScrollPosition - window.scrollY
      lastKnownScrollPosition = window.scrollY

      if (!ticking) {
        window.requestAnimationFrame(function () {
          if (direction < 0) {
            header.classList.add('did-scroll')
            document.documentElement.classList.add('Header--invisible')
            document.documentElement.classList.remove('Header--visible')
            closeNav()
          } else {
            header.classList.remove('did-scroll')
            document.documentElement.classList.remove('Header--invisible')
            document.documentElement.classList.add('Header--visible')
          }
          ticking = false
        })
        ticking = true
      }
    })
  }

  const isLinkActive = (id) => window.location.pathname.includes(id)

  const toggleNav = () => {
    setNavMode((isNavOpen) => !isNavOpen)
    document.documentElement.classList.toggle('Nav--toggled')
  }

  const closeNav = () => {
    setNavMode(false)
    document.documentElement.classList.remove('Nav--toggled')
  }

  // On page load: get navigation items from Google Drive
  useEffect(() => {
    // Get folder from store
    if (folderFromStore) {
      setFolderDocs(folderFromStore)
    }
    // Now get most recent folder contents from Drive
    Meteor.call('drive.getFolderFiles', '148bWv4FCGEeTBeEgwZCFjT7gn748s3vj', (err, res) => {
      const sortedFiles = sortAlphabetically(res, 'name')
      setFolderDocs(sortedFiles)
      // Save folder docs in Redux store
      dispatch(saveFolderFiles(sortedFiles))
    })
  }, [])

  // On page load: init autoHideHeader
  useEffect(() => {
    autoHideHeader()
  }, [])

  return (
    <header className='Header' id='Header'>
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

        <a
          className='Header__logo'
          href='/'
          onClick={() => {
            // Navigate to home
            FlowRouter.go('/')
            // Scroll to top
            window.scrollTo(0, 0)
            // Close nav if on mobile
            !isDesktop && closeNav()
          }}
        >
          <img className='Header__image' src='/images/logo-nijverhoek.png' width='290' height='80' />
        </a>

        <nav className='Header__nav Nav--header' id='a11y-main-menu-collapse' aria-hidden={!isNavOpen}>
          <ul className='Nav__items'>
            {folderDocs &&
              [
                ...folderDocs,
                { id: 'a', name: 'Zonnepanelen: bbbbb', webViewLink: '/' },
                { id: 'b', name: 'Zonnepanelen: hhhhh', webViewLink: '/' },
                { id: 'd', name: 'Zonnepanelen: xxxxx', webViewLink: '/' },
                { id: 'd', name: 'Zonnepanelen: zzzzz', webViewLink: '/' }
              ].map((x, i, array) => {
                // Don't render nav items with forbidden words
                const navTitleContainsForbiddenWord =
                  navItemsToExclude.filter((forbiddenWord) => x.name.indexOf(forbiddenWord) > -1).length >= 1
                if (navTitleContainsForbiddenWord) return

                // Submenu
                // Check if a nav item has children (a.k.a. when next nav item starts with the same name followed by a colon)
                const navItemHasChildren = array[i + 1] && array[i + 1].name.startsWith(`${x.name}:`)
                // Create an array with the current nav item's children. When an item has children, the array's length is >= 1. Otherwise it's 0.
                const navItemChildren = array.filter((navItem) => navItem['name'].startsWith(`${array[i].name}:`))
                // Remove that same amount of children from the original array, so that the children aren't rendered as main menu items.
                navItemChildren.length >= 1 ? array.splice(i + 1, navItemChildren.length) : undefined
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

                    {navItemHasChildren && (
                      <>
                        <button>
                          <span>Submenu toggle</span>
                          <svg className='Nav__icon' width='10px' height='10px' aria-hidden='true'>
                            <use xlinkHref='#icon--chevron' />
                          </svg>
                        </button>
                        <ul>
                          {navItemChildren
                            .filter((item) => item.name.startsWith(`${x.name}:`))
                            .map((n) => (
                              <li>{n.name.replace(`${x.name}:`, '')}</li>
                            ))}
                        </ul>
                      </>
                    )}
                  </li>
                )
              })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
