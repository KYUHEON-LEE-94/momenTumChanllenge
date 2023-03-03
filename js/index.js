// ----- 실시간 시계 ----- 
const clock = document.querySelector('h2#clock')
function sayHello() {
    const date = new Date();
    const hours = String(date.getHours()).padStart(2,"0")
    const minutes = String(date.getMinutes()).padStart(2,"0")
    const seconds = String(date.getSeconds()).padStart(2,"0")
    clock.innerHTML = `${hours} : ${minutes}: ${seconds}`
}
//string을(2자리수로 만든다, 부족한 자리에는 0을 집어넣어라)
"1".padStart(2, "0")
//간격으로 동작
setInterval(sayHello, 1000)

//----- TodoList -----
let toDoForm = document.getElementById('todo-form')
const toDoINput =toDoForm.querySelector('input')
let toDoList = document.getElementById('todo-list')
const addBtn = document.querySelector('#addBtn')

const TODOS_KEY = "todos"

let toDos = [];

function saveToDos() {
    localStorage.setItem(TODOS_KEY, JSON.stringify(toDos))
}

function deleteToDo(event) {
    const li = event.target.parentElement
    //li.id는 String, toDo.id는 Int
    li.remove();
    toDos = toDos.filter(toDo => toDo.id !== parseInt(li.id))
    saveToDos()
}

function paintToDo(newTodoObj){
    const li = document.createElement('li')
    li.id = newTodoObj.id
    const span = document.createElement('span')
    span.innerHTML = "- "+newTodoObj.text    
    const button = document.createElement('button')
    button.innerHTML = "❌"
    button.addEventListener('click',deleteToDo)
    li.appendChild(span)
    li.appendChild(button)    
    toDoList.appendChild(li)
}

function handleToDoSubmit(event){
    event.preventDefault();
    const newTodo = toDoINput.value
    toDoINput.value = "";
    const newTodoObj = {
        text:newTodo,
        id: Date.now()
    }
    toDos.push(newTodoObj)
    paintToDo(newTodoObj)
    saveToDos();
}
toDoForm.addEventListener('submit', handleToDoSubmit)
addBtn.addEventListener('click', handleToDoSubmit)

const savedToDos = localStorage.getItem(TODOS_KEY);
if(savedToDos){
    const parsedToDos = JSON.parse(savedToDos);
    //이전의 localStorage값들을 toDos가 갖고 시작할 수 있게 할당
    toDos = parsedToDos;
    parsedToDos.forEach(paintToDo)
}
// ----- 바탕화면 -----
const images = [
    "0.jpg",
    "1.jpg",
    "2.jpg"
]

function imageSetting() {
const chosenImage = images[Math.floor(Math.random()*images.length)]

const bgImage = document.createElement('img')
bgImage.src = `/MomenTumProject/img/${chosenImage}`
document.body.appendChild(bgImage)    
}

// -----날씨와 위치 API -----
const API_KEY = "e8200893570dcb521079d60b3be3b6b7";

//잘됬을때의 인자, 실패했을때의 인자
function onGeoOk(position){
  const lat = position.coords.latitude;
  const lon =  position.coords.longitude;
  
   const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
   console.log(url)
   fetch(url)
   .then(response => response.json())
   .then(data => {
    imageSetting()
    const weather =document.querySelector('#weather span:first-child')
    const city =document.querySelector('#weather span:last-child')
    city.innerHTML = data.name
    weather.innerHTML = `${data.weather[0].main}(${data.weather[0].description})`
   })
}
function onGeoError(){
    console.log("Can't find you. No weather for you.")
}
navigator.geolocation.getCurrentPosition(onGeoOk, onGeoError)