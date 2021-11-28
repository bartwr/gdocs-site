export const isLinkActive = (id) => window.location.pathname.includes(id)

export const isChildActive = (children) => children.filter((child) => child.id).find((child) => window.location.pathname.includes(child.id))
  ? true
  : false

