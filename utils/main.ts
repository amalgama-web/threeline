export const delay = async (delay: number = 2000) => {
  return new Promise(r => setTimeout(r, delay))
}
