
const linkEl = document.querySelector(".links")

const modal = document.querySelector(".link-add-bg")
const addShortcut = document.querySelector("#addShortcut")
const addclose = document.querySelector(".add-close")
const addsubmit = document.querySelector(".add-submit")

const addform = document.querySelector(".link-add form")
const addname = document.querySelector(".link_name")
const addurl = document.querySelector(".link_url")

let newname = ""
let newurl = ""
let itemID = 0

let links = []
let ids = []

addShortcut.addEventListener("click", linkAdd)
addclose.addEventListener("click", closeModal)
addsubmit.addEventListener("click", handleAddSubmit)

/*링크 저장*******************/

function saveLinks() {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

/*링크 추가*******************/
const LINKS_KEY = "links"

function linkAdd() {
  modal.classList.remove("hidden")
  addsubmit.style.backgroundColor = "#b5b5b5"
  addsubmit.setAttribute("disabled","true")
}

/*링크 추가 버튼 이벤트*******************/
addurl.oninput = function() {addInputOnchange()}
addurl.onchange = function() {addInputOnchange()}

function addInputOnchange() {
  newurl = addurl.value
  if(newurl == "") {
    addsubmit.style.backgroundColor = "#b5b5b5"
    addsubmit.setAttribute("disabled","ture")
  } else if(newurl != ""){
    addsubmit.style.backgroundColor = "#8d97e3"
    addsubmit.removeAttribute("disabled")
  }
}

/*링크 추가 이벤트*******************/
function handleAddSubmit(event) {
  event.preventDefault()
  modal.classList.add("hidden")
  newname = addname.value
  newurl = addurl.value
  addname.value = ""
  addurl.value = ""

  let newLinkObj = ""

  if(event.target == addclose){
    closeModal()
  } else {
    if(itemID == null  || itemID == 0) {
      newLinkObj = {
      id: Date.now(),
      name: newname,
      url: newurl
      }

      links.push(newLinkObj)
      paintLink(newLinkObj)

    } else  {
      console.log(links)

      let index = links.findIndex(link => link.id == parseInt(itemID))

      links[index].name = newname
      links[index].url = newurl
      
      console.log(links)
      
    }
    saveLinks()
    location.reload()
  }
}

/*링크 추가 창 닫기*******************/
function closeModal() {
  modal.classList.add("hidden")
}

/*링크 불러오기*******************/

const savedLinks = localStorage.getItem(LINKS_KEY)

if (savedLinks !== null) {
  const parsedLinks = JSON.parse(savedLinks)
  links = parsedLinks
  parsedLinks.forEach(paintLink)
}




/*링크 그리기*******************/
function paintLink(newLink) {
  let newitem = document.createElement('a')
  newitem.id = newLink.id

  newitem.setAttribute("href", `${newLink.url}`)
  newitem.setAttribute("class", "link-item")

  console.log(newitem.href)
  let linkurl = newitem.href
  let linksplit = linkurl.split(".")
  let linklength = linksplit.length
  let urlname = ""


  //console.log(linksplit[linklength-1])
  if( linksplit[linklength-1] == "com/"){
    urlname = linksplit[linklength-2]
  }else if(linksplit[linklength-1] == "kr/") {
    urlname = linksplit[linklength-3]
  }
  

  newitem.innerHTML = ` <span id="link-more" class="material-icons btn-linkmore hidden">
                          more_vert
                        </span>
                        <div class="btn-thumb"><span class="thumb ${urlname}"></span></div>
                        <span class="item_title">${newLink.name}</span>
                        
                        <div id="link-menu" class="hidden"> 
                          <button class="drop-item link-edit">바로가기 수정</button>  
                          <button class="drop-item link-delete">삭제</button>
                        </div>`


  linkEl.insertBefore(newitem, addShortcut)
}

/*링크 마우스오버 이벤트*******************/
const linkItem = document.querySelectorAll(".link-item")
const linkMore = document.querySelectorAll(".btn-linkmore")

let items = []
let mores = []
let chil = []

linkItem.forEach( (e) => {
  e.addEventListener("mouseover", hoverItem)
  e.addEventListener("mouseout", outItem)
  items.push(e)
  chil.push(e.childNodes[1], e.childNodes[3], e.childNodes[5])
})

linkMore.forEach( (e) => {
  mores.push(e)
  e.addEventListener("mouseover", hoverItem)
   e.addEventListener("click", clickMore)
})

function hoverItem(event) {
  const im = event.target
  const par = event.target.parentNode
  for(let i=0;i<=items.length;i+=1){
    for(let j=0;j<=chil.length;j+=1){
      if(event.target == items[i]){
        im.childNodes[1].classList.remove("hidden")
      } else if(event.target == chil[j]){
        par.childNodes[1].classList.remove("hidden")
      }
    }
  }
}

function outItem(event) {
  const par = event.target.parentNode

  for(let i=0;i<=items.length;i+=1){
    if(event.target == items[i]){
      event.target.childNodes[1].classList.add("hidden")
    } else if(event.target == mores[i]){
      par.childNodes[1].classList.add("hidden")
    }
  }
}

/*링크 메뉴*******************/
// const drop = document.querySelectorAll("#link-menu")

let drops = []
let menuon = false
let dropsmenu = ""

function clickMore(event) {
   event.preventDefault()
   dropsmenu = event.target.parentNode.childNodes[7]
   dropsmenu.classList.remove("hidden")
   menuon = true
} 

document.addEventListener("click", function(e) {
  if(menuon == true) {
    if(e.target.id != "link-more") {
      dropsmenu.classList.add("hidden")
      menuon = false
    }
  }
})

const linkedit = document.querySelectorAll(".link-edit")
const linkdelete = document.querySelectorAll(".link-delete")

linkedit.forEach( (e) => {
  e.addEventListener("click", editMenu)
})

linkdelete.forEach( (e) => {
  e.addEventListener("click", deleteMenu)
})

function deleteMenu(event) {
  event.preventDefault()
  const item = event.target.closest(".link-item")
  item.remove()
  
  links = links.filter(link => link.id !== parseInt(item.id ))
  

  saveLinks()
}


function editMenu(event) {
  event.preventDefault()
  modal.classList.remove("hidden")
  console.log("test1:", itemID)
  const thisitem = event.target.closest(".link-item")
  itemID = thisitem.id
  console.log("test2:", itemID)
  let savedname = ""
  let savedurl = ""

  for(let i=0;i<links.length;i+=1){
    if(links[i].id == itemID) {
      savedname = links[i].name
      savedurl = links[i].url
    }
  }
  
  addname.value = savedname
  addurl.value = savedurl

}
