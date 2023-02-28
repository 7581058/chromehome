const toggleButton = document.querySelector(".toggle-switch");
const engineTitle = document.querySelector(".engine-title")

let googleEngine = true

toggleButton.addEventListener("click", function () {

  toggleButton.classList.toggle("active")
  
  if (googleEngine){
    engineTitle.innerText = "NAVER"
    googleEngine  = false 
  } else {
    engineTitle.innerText = "GOOGLE"
    googleEngine  = true
  }
})

const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-form input")
searchForm.addEventListener("submit", handleSearchSubmit)

function handleSearchSubmit() {
  let url = ""
  let inputtext = searchInput.value

  if(googleEngine == false) {
    url = "https://search.naver.com/search.naver?query=" + inputtext
  } else {
    url = "http://www.google.com/search?q=" + inputtext
  }
  window.open(url, target="_blank")
}


