import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { isChildActive, isLinkActive } from './HeaderUtils.js'
// Import components
import { SubNav } from './SubNav.jsx'
import { saveFolderFiles } from '/imports/reducers/folder'
import { isDesktop } from '/imports/ui/AppUtils'

// Exclude nav items if they contain a forbidden word
const filterFolderDocs = (folderDocs) => {
  if(! folderDocs) return folderDocs;
  const navItemsToExclude = ['TEMPLATE', 'Welkom!', 'DRAFT']

  return folderDocs.filter((x) => {
    const navTitleContainsForbiddenWord =
      navItemsToExclude.filter((forbiddenWord) => x.name.indexOf(forbiddenWord) > -1).length >= 1
    return ! navTitleContainsForbiddenWord;
  })
}

export const Header = () => {
  const dispatch = useDispatch()

  // Get folder from store
  const folderFromStore = useSelector((state) => state.folder)

  const [folderDocs, setFolderDocs] = useState([])
  const [isNavOpen, setNavMode] = useState(false)

  const toggleNav = () => {
    setNavMode((isNavOpen) => !isNavOpen)
    document.documentElement.classList.toggle('Nav--toggled')
  }

  const closeNav = () => {
    setNavMode(false)
    document.documentElement.classList.remove('Nav--toggled')
  }

  // Keep navigation open when screen is wider than 1920px
  // window.addEventListener('resize', function(event) {
  //   if(window.innerWidth >= 1920) { // 1920px
  //   setNavMode(true)
  //   document.documentElement.classList.add('Nav--toggled')
  //   } else {
  //     isNavOpen && closeNav()
  //   }
  // }, true);

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

  // Filter folderDocs
  filteredFolderDocs = filterFolderDocs(folderDocs);

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
            {filteredFolderDocs &&
              filteredFolderDocs.map((x, i, array) => {
                // Submenu
                // Check if a nav item has children (a.k.a. when next nav item starts with the same name followed by a colon)
                const navItemHasChildren = array[i + 1] && array[i + 1].name.startsWith(`${x.name}:`)
                // Create an array with the current nav item's children. When an item has children, the array's length is >= 1. Otherwise it's 0.
                const navItemChildren = array.filter((navItem) => navItem['name'].startsWith(`${array[i].name}:`))
                // Remove that same amount of children from the original array, so that the children aren't rendered as main menu items.
                navItemChildren && navItemChildren.length >= 1 ? array.splice(i + 1, navItemChildren.length) : undefined

                return (
                  <li key={x.id} className='Nav__item'>
                    <a
                      href='#'
                      target='_self'
                      className={`Nav__link${
                        isLinkActive(x.id) || isChildActive(navItemChildren) ? ' Nav__link--active' : ''
                      } `}
                      onClick={(e) => {
                        e.preventDefault()
                        closeNav()
                        FlowRouter.go('/d/' + x.id)
                      }}
                    >
                      <span className='Nav__label'>{x.name}</span>
                    </a>

                    {navItemHasChildren && <SubNav rootNavItem={x} subNavItems={navItemChildren} closeNav={closeNav} />}
                  </li>
                )
              })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
