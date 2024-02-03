export const delay = async (delay: number = 300) => {
  return new Promise(r => setTimeout(r, delay))
}
