
const usleep = async (ms) => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
const sleep = async (s) => {
  return new Promise(resolve => {
    setTimeout(resolve, s * 1000)
  })
}

module.exports = {
  sleep,
  usleep
}
