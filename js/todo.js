
const todoForm = document.querySelector("#todo_form")
const todoInput = document.querySelector("#todo_form input")
const todoList = document.querySelector("#todo_list")

let todos = []
let checkstate = []

const TODOS_KEY = "todos"
const CHECKSTATE_KEY = "checkstate"

function saveTodos() {
  localStorage.setItem(TODOS_KEY, JSON.stringify(todos))
}



function deleteTodo(event) {
  // const li = event.target.parentElement
  const li = event.target.closest("li")
  li.remove()
  console.log(todos)
  todos = todos.filter(todo => todo.id !== parseInt(li.id))
  console.log(todos)
  saveTodos()

  checkstate = checkstate.filter(checkstate => checkstate.id !== (`checkbox${li.id}`))
  checkSave("checkstate", checkstate)
}

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
  span.setAttribute("class", "todo_text")
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

function paintState(item) {
  const box = document.querySelector(`#${item.id}`)
  box.checked = item.state
}
function handleTodoSubmit(event) {
  // event.preventDefault()
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

const savedTodos = localStorage.getItem(TODOS_KEY)

if (savedTodos !== null) {
  const parsedTodos = JSON.parse(savedTodos)
  todos = parsedTodos
  parsedTodos.forEach(paintTodo);
}

function checkSave(name, val) {
  typeof(Storage) !== 'undefined' && localStorage.setItem(name, JSON.stringify(val))
}

const savedState = localStorage.getItem(CHECKSTATE_KEY)

if (savedState !== null) {
  const parsedState = JSON.parse(savedState)
  checkstate = parsedState
  // console.log(checkstate)
  parsedState.forEach(paintState)
}


const label = document.querySelectorAll("#todo-list li label")

function inputChecked(e) {
  console.log("체크박스누름")
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

for (let x=0; x<label.length; x++){
  label[x].addEventListener("click", inputChecked)
}

