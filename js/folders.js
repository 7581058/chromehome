const folderEl = document.querySelector("#folders")
const addbutton = document.querySelector(".btn-addfolder")
const links = document.querySelector(".links")

let folderbtn = []
let foldercount = 0
let deletedfolder = []

//키
const FOLDERS_KEY = "folders"
//생성된 폴더id 저장용 
let folders = []

addbutton.addEventListener("click", clickAdd)

function clickAdd() {
  if(foldercount >= 5) {
    alert("폴더추가는 5개 까지입니다")
  }else {
    if(deletedfolder == ""){
      foldercount+=1
      let newbutton = document.createElement('div')
      newbutton.innerHTML = `&#8226;<div id="foldermenu" class="foldermenu hidden" value="${foldercount}">삭제하기</div>`
      newbutton.setAttribute("id", `folder${foldercount}`)
      newbutton.setAttribute("class", `btn-folder folder${foldercount}`)
      folderEl.insertBefore(newbutton, addbutton)
     }else {
      foldercount+=1
      let shiftfolder =  deletedfolder.shift()
      let newbutton = document.createElement('div')
      newbutton.innerHTML = `&#8226;<div id="foldermenu" class="foldermenu hidden" value="${foldercount}">삭제하기</div>`
      newbutton.setAttribute("id", `${shiftfolder}`)
      newbutton.setAttribute("class", `btn-folder ${shiftfolder}`)
      folderEl.insertBefore(newbutton, addbutton)
     }
    
  }
  folderbtn = document.querySelectorAll(".btn-folder")
  folderbtn.forEach(item => {
    item.addEventListener("click", function() {
        if(item.id == "folder1") {
          links.style.borderBottom = '8px solid #C27E82'
        }else if(item.id == "folder2") {
          links.style.borderBottom = '8px solid #C2AA57'
        }else if(item.id == "folder3") {
          links.style.borderBottom = '8px solid #61C279'
        }else if(item.id == "folder4") {
          links.style.borderBottom = '8px solid #5776C2'
        }else {
          links.style.borderBottom = '8px solid #485882'
        }
    }) 
    item.addEventListener("mouseup", clickRight);
  })

  
  for(let i=0;i < folderbtn.length; i++){
  console.log("생성된버튼:", folderbtn[i].id)
  
  folders.push(folderbtn[i].id)
  const set = new Set(folders)
  folders = [...set]
  }
  saveFolder()
 
}

/*윈도우 기본 우클릭 방지*/
window.oncontextmenu = function () {
  return false;
}

let menubtn = ""
let menuon = false

/*폴더 우클릭 이벤트*/
const clickRight = event => {
  if((event.which == 3) || (event.button == 2)) {
    menuon = true
    console.log("right>>", event)
    event.target.childNodes[1].classList.remove("hidden")
    menubtn = event.target.childNodes[1]
    menubtn.addEventListener("click", removeFolder)
  }
}

function removeFolder(e) {
  
    console.log("폴더삭제클릭", e.target.parentNode.id)
    deletedfolder.push(e.target.parentNode.id)
    console.log("삭제배열추가>", deletedfolder)
    const item = e.target.closest(".btn-folder")
    item.remove()
    foldercount-=1
    console.log("count:",foldercount)

    console.log("삭제할때폴더들:",folders)
    folders = folders.filter(fol => fol !== item.id )
    console.log("필터후폴더들:",folders)
    saveLinks()
}

document.addEventListener("click", function(e) {
  if(menuon == true) {
    if(e.target.id != "foldermenu") {
      menubtn.classList.add("hidden")
      menuon = false
    }
  }
})


/*폴더 개수 저장**********/

function saveFolder() {
  localStorage.setItem(FOLDERS_KEY, JSON.stringify(folders))
}

/*저장된 폴더 불러오기*/
const savedFolders = localStorage.getItem(FOLDERS_KEY)

if (savedFolders !== null) {
  const parsedFolders = JSON.parse(savedFolders)
  folders = parsedFolders
  console.log("파싱후:",parsedFolders)
  for(let i in folders) {
    paintFolder(folders[i])
  }
  //parsedFolders.forEach(paintFolder)
}

/*저장된 폴더 그리기*/
function paintFolder(data) {
    console.log("페인트:",folders)
    let newbutton = document.createElement('div')
    newbutton.innerHTML = `&#8226;<div id="foldermenu" class="foldermenu hidden">삭제하기</div>`
    // newbutton.setAttribute("id", `${i}`)
    newbutton.setAttribute("class", `btn-folder folder${data}`)
    folderEl.insertBefore(newbutton, addbutton)
  
}


