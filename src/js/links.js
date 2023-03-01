const linkEl = document.querySelector(".links")
const modalBackground = document.querySelector(".link-add-bg")
const linkAddButton = document.querySelector("#link-add-button")
const modalCloseButton = document.querySelector(".modal-close-button")
const modalSubmitButton = document.querySelector(".modal-submit-button")
const modalNameInput = document.querySelector(".link-name")
const modalUrlInput = document.querySelector(".link-url")

//모든 링크 - 로컬 저장,불러오기 
let links = [] 

// 폴더별 링크 
let folderlinks = []

//추가한 링크 이름, url
let newname = ""
let newurl = ""

//저장된 링크 id 
let itemid = 0

//링크아이템 저장 => 링크 메뉴 마우스 이벤트용  
let items = []

//각 링크 메뉴 저장 => 링크 메뉴 마우스 이벤트용(마우스아웃) 
let mores = []

//링크 자식노드 저장 
let linkchild = []

//링크 메뉴 열림닫힘 체크
let menuon = false

//클릭한 링크 메뉴 노드 저장 => 열림닫힘 이벤트 
let dropmenu = ""

//로컬스토리지 키 
const LINKS_KEY = "links"


linkAddButton.addEventListener("click", showModal)
modalCloseButton.addEventListener("click", closeModal)
modalSubmitButton.addEventListener("click", handleAddSubmit)

/*폴더 클릭 이벤트*******************/
const folderButtons = document.querySelectorAll(".folder-button")

let currentfolder = "folder1"

for (let i = 0; i < folderButtons.length; i++) {
	folderButtons[i].addEventListener("click", function() {
		currentfolder = folderButtons[i].id
    if (savedLinks !== null) {
      const parsedLinks = JSON.parse(savedLinks)
      links = parsedLinks
      folderlinks = links.filter(link => link.folder == currentfolder)

      const itemss = document.querySelectorAll(".link-item")
      for(let i=0; i < itemss.length; i++)
      linkEl.removeChild(itemss[i])

      folderlinks.forEach(paintLink)
    }
    handleLinkItem()
	})
}

/*링크 로컬스토리지 저장*******************/
function saveLinks() {
  localStorage.setItem(LINKS_KEY, JSON.stringify(links))
}

/*링크 추가 창 열기*******************/
function showModal() {
  modalBackground.classList.remove("hidden")
  modalSubmitButton.style.backgroundColor = "#828282"
  modalSubmitButton.setAttribute("disabled","true")
}

/*링크 추가 창 닫기*******************/
function closeModal() {
  modalBackground.classList.add("hidden")
  modalNameInput.value = ""
  modalUrlInput.value = ""
  modalSubmitButton.style.backgroundColor = "#828282"
  modalSubmitButton.style.color = "#222"
}

/*링크 추가, 수정시 인풋 입력감지 이벤트*******************/
modalUrlInput.oninput = function() {inputOnchange()}
modalUrlInput.onchange = function() {inputOnchange()}

function inputOnchange() {
  newurl = modalUrlInput.value
  if(newurl == "") {
    modalSubmitButton.style.backgroundColor = "#828282"
    modalSubmitButton.style.color = "#222"
    modalSubmitButton.setAttribute("disabled","ture")
  } else if(newurl != ""){
    modalSubmitButton.style.backgroundColor = "#222"
    modalSubmitButton.style.color = "#fff"
    modalSubmitButton.removeAttribute("disabled")
  }
}

/*링크 추가 이벤트*******************/
function handleAddSubmit(event) {
  event.preventDefault()
  modalBackground.classList.add("hidden")
  newname = modalNameInput.value
  newurl = modalUrlInput.value
  modalNameInput.value = ""
  modalUrlInput.value = ""

  let newLinkObj = ""

  if(event.target == modalCloseButton){
    closeModal()
  } else {
    if(itemid == null  || itemid == 0) {
      newLinkObj = {
      folder: currentfolder,
      id: Date.now(),
      name: newname,
      url: newurl
      }
      links.push(newLinkObj)
      paintLink(newLinkObj)

    } else  {
      let index = links.findIndex(link => link.id == parseInt(itemid))

      links[index].name = newname
      links[index].url = newurl
    }
    saveLinks()
    location.reload()
  }
}

/*링크 불러오기*******************/
const savedLinks = localStorage.getItem(LINKS_KEY)

if (savedLinks !== null) {
  const parsedLinks = JSON.parse(savedLinks)

  links = parsedLinks
  folderlinks = links.filter(link => link.folder == "folder1")
  folderlinks.forEach(paintLink)
}

/*링크 그리기*******************/
function paintLink(newLink) {
  let newitem = document.createElement('a')
  newitem.id = newLink.id

  newitem.setAttribute("href", `${newLink.url}`)
  newitem.setAttribute("class", "link-item")

  //저장된 url 파싱 
  let linkurl = newitem.href
  linkurl = linkurl.substring(8);
  let linksplit = linkurl.split(".")
  let linklength = linksplit.length
  let urlname = ""

  //주소에따라 이름 걸러내기 
  if( linksplit[linklength-1] == "com/" || linksplit[linklength-1] == "net/" || linksplit[linklength-1] == "co/" || linksplit[linklength-1] == "io/"){
    urlname = linksplit[linklength-2]
  }else if(linksplit[linklength-1] == "kr/") {
    urlname = linksplit[linklength-3]
  }
  
  newitem.innerHTML = ` <span id="link-more-button" class="material-icons link-more-button hidden">
                          more_vert
                        </span>
                        <div class="item__thumb">
                          <span class="favicon ${urlname}"></span>
                        </div>
                        <span class="item__title">${newLink.name}</span>
                        <div id="link-more-drop" class="hidden"> 
                          <button class="drop__item link-edit">바로가기 수정</button>  
                          <button class="drop__item link-delete">삭제</button>
                        </div>`

  linkEl.insertBefore(newitem, linkAddButton)
}

function handleLinkItem() {
  /*링크 마우스오버 이벤트*******************/
  const linkItem = document.querySelectorAll(".link-item")
  const linkMore = document.querySelectorAll(".link-more-button")

  linkItem.forEach( (e) => {
    e.addEventListener("mouseover", hoverItem)
    e.addEventListener("mouseout", outItem)
    items.push(e)
    linkchild.push(e.childNodes[1], e.childNodes[3], e.childNodes[5])
  })

  linkMore.forEach( (e) => {
    mores.push(e)
    e.addEventListener("mouseover", hoverItem)
    e.addEventListener("click", clickMore)
  })

  /*링크 수정 삭제 클릭 이벤트*******************/
  const linkedit = document.querySelectorAll(".link-edit")
  const linkdelete = document.querySelectorAll(".link-delete")

  linkedit.forEach( (e) => {
    e.addEventListener("click", editLink)
  })

  linkdelete.forEach( (e) => {
    e.addEventListener("click", deleteLink)
  })
}
handleLinkItem()
///////////////////////////////////////////////////////////


function hoverItem(event) {
  
  const im = event.target
  const par = event.target.parentNode

  for(let i=0;i<=items.length;i+=1){
    for(let j=0;j<=linkchild.length;j+=1){
      if(event.target == items[i]){
        im.childNodes[1].classList.remove("hidden")
      } else if(event.target == linkchild[j]){
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

/*링크 메뉴버튼 클릭 이벤트*******************/
function clickMore(event) {
   event.preventDefault()
   dropmenu = event.target.parentNode.childNodes[7]
   dropmenu.classList.remove("hidden")
   menuon = true
} 

/*메뉴 아닌 다른 곳 클릭시 메뉴 닫히기*******************/
document.addEventListener("click", function(e) {
  if(menuon == true) {
    if(e.target.id != "link-more-button") {
      dropmenu.classList.add("hidden")
      menuon = false
    }
  }
})

/*링크 삭제*******************/
function deleteLink(event) {
  event.preventDefault()
  const item = event.target.closest(".link-item")
  item.remove()
  links = links.filter(link => link.id !== parseInt(item.id))
  saveLinks()
  location.reload()
}

/*링크 수정*******************/
function editLink(event) {
  event.preventDefault()
  modalBackground.classList.remove("hidden")
  const thisitem = event.target.closest(".link-item")
  itemid = thisitem.id

  let savedname = ""
  let savedurl = ""

  for(let i=0;i<links.length;i+=1){
    if(links[i].id == itemid) {
      savedname = links[i].name
      savedurl = links[i].url
    }
  }
  modalNameInput.value = savedname
  modalUrlInput.value = savedurl
}



