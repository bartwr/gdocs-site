import React, { useState } from 'react'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { isChildActive, isLinkActive } from './HeaderUtils.js'

export const SubNav = (props) => {
  const { rootNavItem, subNavItems, closeNav } = props
  const [isSubNavOpen, setSubNavMode] = useState(isChildActive(subNavItems))

  const toggleSubNav = () => {
    setSubNavMode((isSubNavOpen) => !isSubNavOpen)
  }

  return (
    <>
      <button
        className={`Nav__toggler ${isChildActive(subNavItems) ? 'Nav__toggler--active' : ''}`}
        aria-controls={`a11y-sub-menu-${rootNavItem.id}`}
        aria-expanded={isSubNavOpen}
        onClick={() => toggleSubNav()}
      >
        <span className='sr-text'>Submenu</span>
        <svg className='Nav__icon' width='12px' height='12px' aria-hidden='true'>
          <use xlinkHref='#icon--chevron' />
        </svg>
      </button>
      <ul className='Nav__subitems' id={`a11y-sub-menu-${rootNavItem.id}`} aria-hidden={!isSubNavOpen}>
        {subNavItems.map((xs) => (
          <li key={xs.id} className='Nav__item Nav__subitem'>
            <a
              href='#'
              target='_self'
              className={`Nav__sublink Nav__link${isLinkActive(xs.id) ? ' Nav__link--active' : ''} `}
              onClick={(e) => {
                e.preventDefault()
                closeNav()
                FlowRouter.go('/d/' + xs.id)
              }}
            >
              <span className='Nav__label'>{xs.name.replace(`${rootNavItem.name}: `, '')}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  )
}
