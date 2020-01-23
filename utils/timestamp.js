const colors = require('./colors')

module.exports = () => {
  const date = new Date()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  let month = date.getMonth() + 1
  let day = date.getDate()
  month = month < 10 ? '0' + month : month
  day = day < 10 ? '0' + day : day
  hours = hours < 10 ? '0' + hours : hours
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  return `${colors.RED}[${colors.GREEN}${date.getFullYear()}-${month}-${day}${colors.RESTORE}|${colors.YELLOW}${hours}:${minutes}:${seconds}${colors.RED}]${colors.RESTORE}`
}
