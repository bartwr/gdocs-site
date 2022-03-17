import React, { useEffect, useState } from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
  let lastKnownScrollPosition = 0;

  // Get folder from store
  const folderFromStore = useSelector((state) => state.folder)

  // State variables
  const [folderDocs, setFolderDocs] = useState([])
  const [isNavOpen, setNavMode] = useState(false)
  const [doAutoHideNav, setDoAutoHideNav] = useState(true)

  // Sort array on sub key
  const sortAlphabetically = (elements, key) => {
    return elements.sort((a, b) => {
      return a[key].toLowerCase() < b[key].toLowerCase() ? -1 : 1
    })
  }

  const toggleNav = () => {
    setNavMode((isNavOpen) => !isNavOpen)
    document.documentElement.classList.toggle('Nav--toggled')
  }

  const openNav = () => {
    setNavMode(true)
    document.documentElement.classList.add('Nav--toggled')
  }

  const closeNav = (force = false) => {
    // Only close nav if needed
    if(doAutoHideNav === false && force !== true) {
      return;
    }

    setNavMode(false)
    document.documentElement.classList.remove('Nav--toggled')
  }

  const handleResize = () => {
    // On large screens:
    if(window.innerWidth >= 1880) {
      // Don't autohide nav
      setDoAutoHideNav(false);
      // Show nav sidebar by default
      openNav();
    }
    // On smaller screens:
    else {
      // Do auto hide nav
      setDoAutoHideNav(true);
      // Hide nav by default;
      setNavMode(false);
    }
  }

  // Hide/show topbar & nav on scroll 
  const scrollHandler = (e) => {
    const header = document.getElementById('Header')

    let direction = 0,
      ticking = false

    direction = lastKnownScrollPosition - window.scrollY
    lastKnownScrollPosition = window.scrollY

    if (! ticking) {
      window.requestAnimationFrame(function () {
        if (direction < 0) {
          if(doAutoHideNav) header.classList.add('did-scroll')
          if(window.innerWidth < 1880) {
            document.documentElement.classList.add('Header--invisible')
            document.documentElement.classList.remove('Header--visible')
          }
          closeNav()
        } else {
          if(doAutoHideNav) header.classList.remove('did-scroll')
          document.documentElement.classList.remove('Header--invisible')
          document.documentElement.classList.add('Header--visible')
        }
        ticking = false
      })
      ticking = true
    }
  }

  // On page load: get navigation items from Google Drive
  useEffect(() => {
    // Get folder from store
    if (folderFromStore) {
      setFolderDocs(folderFromStore)
    }
    // Now get most recent folder contents from Drive
    Meteor.call('drive.getFolderFiles', (err, res) => {
      const sortedFiles = sortAlphabetically(res, 'name')
      setFolderDocs(sortedFiles)
      // Save folder docs in Redux store
      dispatch(saveFolderFiles(sortedFiles))
    })
  }, [])

  // On page load: init autoHideHeader
  useEffect(() => {
    // Auto hide header on scroll
    window.addEventListener('scroll', scrollHandler)

    // Clean up event handlers on state update
    return () => {
      window.removeEventListener('scroll', scrollHandler);
    }
  }, [doAutoHideNav])

  // Window resize actions
  React.useEffect(() => {
    window.addEventListener("resize", handleResize, false);// On resize: handleResize
    handleResize();// On load: handleResize
  }, []);

  // Press escape key actions
  React.useEffect(() => {
    // Close navigation when pressing the escape key
    const handler = (e) => {
      if (e.key === 'Escape') {
        const force = true;
        closeNav(force)
      }
    }
    window.addEventListener('keyup', handler)

    return () => {
      window.removeEventListener('keyup', handler)
    }
  }, [doAutoHideNav]);

  // Close navigation when clicking outside of header/navigation
  React.useEffect(() => {
    const handler = (e) => {
      const target = e.target || e.currentTarget;
      if (target.closest('.Header') === null && document.documentElement.classList.contains('Nav--toggled')) {
        closeNav()
      }
    }
    document.documentElement.addEventListener('click', handler)

    return () => {
      document.documentElement.removeEventListener('click', handler);
    }
  }, [doAutoHideNav]);

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
