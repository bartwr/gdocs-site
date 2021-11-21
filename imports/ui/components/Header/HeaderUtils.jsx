export const convertRemToPx = (rem) => {
  const remValue = typeof rem == 'string' ? parseFloat(rem) : rem
  return parseFloat(getComputedStyle(document.documentElement).fontSize) * remValue
}
