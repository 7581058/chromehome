const clock = document.querySelector("#clock")
const ymd = document.querySelector("#date")

export function getClock() {
  const date = new Date()
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const seconds = String(date.getSeconds()).padStart(2, "0")
  clock.innerText = `${hours}:${minutes}:${seconds}`

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const weeknum = date.getDay()
  const week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  ymd.innerText = `${year}-${month}-${day} ${week[weeknum]}`;

  return hours
}

getClock()
setInterval(getClock, 1000)




