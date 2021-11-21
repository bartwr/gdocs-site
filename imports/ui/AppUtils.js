export const convertRemToPx = (rem) => {
  const remValue = typeof rem == 'string' ? parseFloat(rem) : rem
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * remValue
}

export const isDesktop = window.innerWidth >= convertRemToPx(64) // 1024px
