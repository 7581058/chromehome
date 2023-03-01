const folderEl = document.querySelector("#folders")
const folderAddButton = document.querySelector(".folder-add-button")

const FOLDERS_KEY = "folders"
const COUNT_KEY = "count"
const DELETE_KEY = "deleted"

let folders = ["folder1"] //폴더 배열 
let count = 1 //폴더 갯수
let deletedfolders = [] //삭제한 폴더 배열

let newfolder = ""

folderAddButton.addEventListener("click", clickAdd)

/*폴더 갯수 로컬스토리지 저장*******************/
function saveCount() {
  localStorage.setItem(COUNT_KEY, JSON.stringify(count))
}

/*폴더 갯수 불러오기*******************/
const savedCount = localStorage.getItem(COUNT_KEY)

if (savedCount !== null) {
  let parsedCount = JSON.parse(savedCount)
  count = parsedCount
}

/*삭제한 폴더 로컬스토리지 저장*******************/
function saveDeleted() {
  localStorage.setItem(DELETE_KEY, JSON.stringify(deletedfolders))
}

/*삭제 폴더 불러오기*******************/
const savedDelete = localStorage.getItem(DELETE_KEY)

if (savedDelete !== null) {
  let parsedDeleted = JSON.parse(savedDelete)
  deletedfolders = parsedDeleted
}

/*폴더 추가 이벤트*******************/
function clickAdd(event) {
  if(count >= 5) {
    alert("폴더추가는 5개 까지입니다")
  }else {
    if(deletedfolders.length <= 0) {
      console.log(deletedfolders)
      console.log(deletedfolders.length)
      count += 1
      console.log("count:", count)
      newfolder = "folder" + count 
    }else {
      newfolder = deletedfolders.shift()
      count += 1
      saveDeleted()
    }
    
    saveCount()
    folders.push(newfolder)
    paintFolder(newfolder)
    saveFolders() 
    location.reload()
  }
}

/*생성된 폴더 로컬 스토리지 저장*******************/
function saveFolders() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
}

/*폴더 그리기*******************/
function paintFolder(newfolder) {
  let buttonNew = document.createElement('button')
  buttonNew.innerHTML = `&#8226;<div id="folder-menu" class="folder-menu hidden">폴더삭제</div>`
  buttonNew.setAttribute("type", "button")
  buttonNew.setAttribute("id", `${newfolder}`)
  buttonNew.setAttribute("class", `folder-button ${newfolder}`)
  folderEl.insertBefore(buttonNew, folderAddButton)
}

/*저장된 폴더 불러오기*******************/
const savedFolders = localStorage.getItem(FOLDERS_KEY)

if (savedFolders !== null) {
  let parsedFolders = JSON.parse(savedFolders)
  folders = parsedFolders

  //folders = folders.filter(fol => fol !== item.id )
  parsedFolders = parsedFolders.filter(fol => fol !== "folder1" )
  parsedFolders.forEach(paintFolder)
}


/*윈도우 우클릭 방지*******************/
window.oncontextmenu = function () {
  return false;
}

//폴더 메뉴 노드 저장
let folderMenu = ""

//폴더 메뉴 열림닫힘 체크
let menuon = false

/*폴더 이벤트*******************/
let folderButton = document.querySelectorAll(".folder-button")

folderButton.forEach(item => {
  //폴더 우클릭시 메뉴 보이기
  item.addEventListener("mouseup", function() {
    if((event.which == 3) || (event.button == 2)) {
      menuon = true
      event.target.childNodes[1].classList.remove("hidden")
      folderMenu = event.target.childNodes[1]
      folderMenu.addEventListener("click", removeFolder)
    }
  })
  //클릭한 폴더 활성화
  item.addEventListener("click", function() {
    for (let x = 0; x < folderButton.length; x++) {
      if (folderButton[x] == this) {
        folderButton[x].classList.add('folder_active');
      } else {
        folderButton[x].classList.remove('folder_active');
      }
    }
  }) 
})

/*폴더 메뉴 취소*******************/
document.addEventListener("click", function(e) {
  if(menuon == true) {
    if(e.target.id != "folder-menu") {
      folderMenu.classList.add("hidden")
      menuon = false
    }
  }
})

/*폴더 삭제*******************/
function removeFolder(e) {
  if(count <= 1){
    alert("기본 폴더는 삭제할 수 없습니다")
  }else {
    alert("해당 폴더에 저장된 링크는 전부 삭제됩니다")

    const item = e.target.closest(".folder-button")
    item.remove()

    deletedfolders.push(e.target.parentNode.id)
    saveDeleted()

    folders = folders.filter(fol => fol !== e.target.parentNode.id )
    saveFolders()

    count-=1
    saveCount()

    //삭제한 폴더에 저장된 링크 삭제
    const LINKS_KEY = "links"
    const savedLinks = localStorage.getItem(LINKS_KEY)

    let links = []

    if (savedLinks !== null) {
      const parsedLinks = JSON.parse(savedLinks)
      links = parsedLinks
    }

    links = links.filter(link => link.folder !== e.target.parentNode.id)

    localStorage.setItem(LINKS_KEY, JSON.stringify(links))
    ///  
    location.reload()
  }
}

