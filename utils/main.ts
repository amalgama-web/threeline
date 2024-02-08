export const delay = async (delay: number = 170) => {
  return new Promise(r => setTimeout(r, delay))
}
