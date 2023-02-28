const todoForm = document.querySelector("#todo-form")
const todoInput = document.querySelector("#todo-form input")
const todoList = document.querySelector("#todo-list")

let todos = []
let checkstate = []

const TODOS_KEY = "todos"
const CHECKSTATE_KEY = "checkstate"

/*투두 로컬스토리지 저장*******************/
function saveTodos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
}

/*투두 삭제*******************/
function deleteTodo(event) {
  const li = event.target.closest("li")
  li.remove()

  todos = todos.filter(todo => todo.id !== parseInt(li.id))
  saveTodos()

  checkstate = checkstate.filter(checkstate => checkstate.id !== (`checkbox${li.id}`))
  checkSave("checkstate", checkstate)
}

/*투두 그리기*******************/
function paintTodo(newTodo) {
  const li = document.createElement("li")
  li.id = newTodo.id

  const label = document.createElement("label")
  label.setAttribute("for", "checkbox"+li.id)

  const chkbox = document.createElement("input")
  chkbox.setAttribute("type", "checkbox")
  chkbox.setAttribute("id", "checkbox"+li.id)
  chkbox.setAttribute("class", "checkbox")

  const span = document.createElement("span")
  span.setAttribute("class", "todo__text")
  span.innerText = newTodo.text

  const button = document.createElement("span")
  button.innerText = "clear"
  button.setAttribute("class", "material-icons delete-button")
  button.addEventListener("click", deleteTodo)
  
  li.appendChild(chkbox)
  li.appendChild(label)
  li.appendChild(span)
  li.appendChild(button)
  todoList.appendChild(li)
}

/*투두 체크 그리기*******************/
function paintState(item) {
  const box = document.querySelector(`#${item.id}`)
  box.checked = item.state
}

/*투두 추가 이벤트*******************/
function handleTodoSubmit() {
  const newTodo = todoInput.value
  todoInput.value = ""
  const newTodoObj = {
    id: Date.now(),
    text: newTodo
  }
  todos.push(newTodoObj)
  paintTodo(newTodoObj)
  saveTodos()
}

todoForm.addEventListener("submit", handleTodoSubmit)


/*투두 불러오기*******************/
const savedTodos = localStorage.getItem(TODOS_KEY)

if (savedTodos !== null) {
  const parsedTodos = JSON.parse(savedTodos)
  todos = parsedTodos
  parsedTodos.forEach(paintTodo);
}


/*투두 체크상태 로컬스토리지 저장*******************/
function checkSave(name, val) {
  typeof(Storage) !== 'undefined' && localStorage.setItem(name, JSON.stringify(val))
}

/*투두 체크상태 불러오기*******************/
const savedState = localStorage.getItem(CHECKSTATE_KEY)

if (savedState !== null) {
  const parsedState = JSON.parse(savedState)
  checkstate = parsedState
  parsedState.forEach(paintState)
}

/*투두 체크박스 이벤트*******************/
function inputChecked(e) {
  const checkboxId = e.target.previousSibling.id
  const checkboxState = !e.target.previousSibling.checked

  const newCheckState = {
    id: checkboxId,
    state: checkboxState
  }
  
  checkstate.push(newCheckState)

  const newArray = [...new Map(checkstate.map(item => [item.id, item])).values()]

  checkSave("checkstate", newArray)
}

/*투두 라벨 체크 이벤트*******************/
const label = document.querySelectorAll("#todo-list li label")

for (let x=0; x<label.length; x++){
  label[x].addEventListener("click", inputChecked)
}

