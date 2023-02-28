const buttonAdd = document.querySelector(".folder-add-button")
const folderEl = document.querySelector("#folders")
const backgroundLinks = document.querySelector(".links")

const FOLDERS_KEY = "folders"
const COUNT_KEY = "count"
const DELETE_KEY = "deleted"

let folders = ["folder1"] //폴더 배열 
let count = 1 //폴더 갯수
let deletedfolders = []
let newfolder = ""

buttonAdd.addEventListener("click", clickAdd)

/*폴더 갯수 로컬 스토리지 저장*/
function saveCount() {
  localStorage.setItem(COUNT_KEY, JSON.stringify(count))
}

/*폴더 갯수 불러오기*/
const savedCount = localStorage.getItem(COUNT_KEY)

if (savedCount !== null) {
  let parsedCount = JSON.parse(savedCount)
  count = parsedCount
}



/*삭제 폴더 로컬 스토리지 저장*/
function saveDeleted() {
  localStorage.setItem(DELETE_KEY, JSON.stringify(deletedfolders))
}

/*삭제 폴더 불러오기*/
const savedDelete = localStorage.getItem(DELETE_KEY)

if (savedDelete !== null) {
  let parsedDeleted = JSON.parse(savedDelete)
  deletedfolders = parsedDeleted
}

/*폴더 추가 이벤트*/
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

/*폴터 로컬 스토리지에 저장*/
function saveFolders() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
}

/*폴더 그리기*/
function paintFolder(newfolder) {
  let buttonNew = document.createElement('button')
  buttonNew.innerHTML = `&#8226;<div id="folder-menu" class="folder-menu hidden">폴더삭제</div>`
  buttonNew.setAttribute("type", "button")
  buttonNew.setAttribute("id", `${newfolder}`)
  buttonNew.setAttribute("class", `folder-button ${newfolder}`)
  folderEl.insertBefore(buttonNew, buttonAdd)
}

/*저장된 폴더 불러오기*/
const savedFolders = localStorage.getItem(FOLDERS_KEY)

if (savedFolders !== null) {
  let parsedFolders = JSON.parse(savedFolders)
  folders = parsedFolders

  //folders = folders.filter(fol => fol !== item.id )
  parsedFolders = parsedFolders.filter(fol => fol !== "folder1" )
  parsedFolders.forEach(paintFolder)
}


//윈도우 기본 우클릭 방지
window.oncontextmenu = function () {
  return false;
}

let buttonFolder = []
let folderMenu = ""
let menuon = false


/*폴더 이벤트*/
buttonFolder = document.querySelectorAll(".folder-button")
buttonFolder.forEach(item => {
    item.addEventListener("mouseup", function() {
      if((event.which == 3) || (event.button == 2)) {
        //console.log("우클릭")
        menuon = true
        console.log("right>>", event)
        event.target.childNodes[1].classList.remove("hidden")
        folderMenu = event.target.childNodes[1]
        folderMenu.addEventListener("click", removeFolder)
      }
    })
    item.addEventListener("click", function() {
      for (let x = 0; x < buttonFolder.length; x++) {
        if (buttonFolder[x] == this) {
          buttonFolder[x].classList.add('folder_active');
        } else {
          buttonFolder[x].classList.remove('folder_active');
        }
      }
    }) 
})


/*폴더 메뉴 취소*/
document.addEventListener("click", function(e) {
  if(menuon == true) {
    if(e.target.id != "folder-menu") {
      folderMenu.classList.add("hidden")
      menuon = false
    }
  }
})

/*폴더 삭제*/
function removeFolder(e) {
  if(count <= 1){
    alert("기본 폴더는 삭제할 수 없습니다")
  }else {
    console.log("폴더삭제클릭", e.target.parentNode.id)
    const item = e.target.closest(".folder-button")
    item.remove()

    deletedfolders.push(e.target.parentNode.id)
    saveDeleted()

    folders = folders.filter(fol => fol !== e.target.parentNode.id )
    saveFolders()

    count-=1
    saveCount()

    location.reload()
  }
}

