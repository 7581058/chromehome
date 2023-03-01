import * as clockdata from "./clock.js";

const loginForm = document.querySelector("#login-form")
const loginInput = document.querySelector("#login-form input")
const container = document.querySelector("#container")
const greeting = document.querySelector("#greeting")

const HIDDEN_CLASSNAME = "hidden"
const USERNAME_KEY = "username"

function onLoginSubmit(e) {
  e.preventDefault()
  loginForm.classList.add(HIDDEN_CLASSNAME)
  const username = loginInput.value
  localStorage.setItem(USERNAME_KEY, username)
  paintGreetings(username)
}

function paintGreetings(username) {
  const nowhours = clockdata.getClock()
  if ( nowhours >=6 && nowhours <= 11) {
    greeting.innerText = `good morning ${username}!`
  } else if ( nowhours >=12 && nowhours <= 17) {
    greeting.innerText = `good afternoon ${username}!`
  } else if ( nowhours >=18 && nowhours <= 21) {
    greeting.innerText = `good evening ${username}!`
  } else {
    greeting.innerText = `Hello, ${username}!`
  }
  container.classList.remove(HIDDEN_CLASSNAME)
}

const savedUsername = localStorage.getItem(USERNAME_KEY)

if (savedUsername === null) {
  loginForm.classList.remove(HIDDEN_CLASSNAME)
  loginForm.addEventListener("submit", onLoginSubmit)
} else {
  paintGreetings(savedUsername)
}

