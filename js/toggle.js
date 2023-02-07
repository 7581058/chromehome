const toggleButton = document.querySelector(".toggle-switch");
const engineTitle = document.querySelector(".engine-title")
let googleEngine = true

toggleButton.addEventListener("click", function () {
  toggleButton.classList.toggle("active")
  
  if (googleEngine){
    engineTitle.innerText = "naver"
    googleEngine  = false 
  } else {
    engineTitle.innerText = "google"
    googleEngine  = true
  }
  
})