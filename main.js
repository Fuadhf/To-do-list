const btnAddList = document.querySelector('.button-add');
const inputContainer = document.querySelector('.input-container');
const empty = document.querySelector('.empty');
const btnCancel = document.querySelector('.button-cancel');
const btnInput = document.querySelector('.button-input');
const listTask = document.querySelector('.list-item');  
const taskTitle = document.querySelector('.input-keyword')
const taskOpt = document.querySelector('.input-opt')
const priorityInput = document.querySelector('#priority')
const dateInput = document.querySelector('.due-date')
const editContainer = document.querySelector('.edit-container')
let editTaskId = null;

renderTask()
 
btnAddList.addEventListener('click', function() {
  inputContainer.style.display = 'block';
})

btnInput.addEventListener('click', function() {
  
  if(taskTitle.value === '') {
    alert('Task title cannot be empty')
    return
  };
  empty.style.display = 'none';
  
  const task = {
    id: Date.now(),
    title: taskTitle.value,
    opt: taskOpt.value,
    priority: priorityInput.value,
    deadline: dateInput.value,
    done: false
  }

  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  tasks.push(task)
  localStorage.setItem('tasks', JSON.stringify(tasks))
  resetForm()
  renderTask()
  
  inputContainer.style.display = 'none'
  
  if(listTask.children.length === 0) {
    empty.style.display = 'block'
  };
});

btnCancel.addEventListener('click', function() {
  inputContainer.style.display = 'none';
  editContainer.style.display = 'none'
  editContainer.innerHTML = ''
  resetForm()
});

document.addEventListener('click', function(e) {
  if(e.target.classList.contains('delete')) {
    const hapus = confirm('Are you sure want to delete this task')
    
    if(hapus) {
      const card = e.target.closest('.card')
      const id = Number(card.dataset.id)
      const tasks = JSON.parse(localStorage.getItem('tasks')) || []
      const newTasks = tasks.filter(task => task.id !== id)
      localStorage.setItem('tasks' , JSON.stringify(newTasks))
      renderTask()
      
      if(listTask.children.length === 0) {
        empty.style.display = 'block'
      };
    }
  }

  if(e.target.classList.contains('edit')) {
    const card = e.target.closest('.card')
    const id = Number(card.dataset.id)
    editTaskId = id
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const task = tasks.find(t => t.id === id)

    if(!task) return

    editContainer.innerHTML = editTask(task)
    editContainer.style.display = 'block'
    inputContainer.style.display = 'none'
  }

  if(e.target.classList.contains('button-save')) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const taskIndex = tasks.findIndex(t => t.id === editTaskId)

    if(taskIndex !== -1) {
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title: document.querySelector('.edit-keyword').value,
        opt: document.querySelector('.edit-opt').value,
        priority: document.querySelector('#edit-priority').value,
        deadline: document.querySelector('.edit-date').value
      }
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTask()
      editContainer.style.display= 'none'
      editContainer.innerHTML = ''
    }
  }
  
  if(e.target.classList.contains('button-edit-cancel')) {
    editContainer.style.display= 'none'
    editContainer.innerHTML = ''
  }

  if(e.target.className === 'drop') {
    const card = e.target.closest('.card')
    const opt = card.querySelector('.opt')
    opt.classList.toggle('show')
    e.target.src = opt.classList.contains('show')
    ? './icon/dropdown.png' : './icon/dropup.png'
  }  
  
  if(e.target.classList.contains('check-list')) {
    const card = e.target.closest('.card')
    const id = Number(card.dataset.id)
    const h4 = e.target.nextElementSibling
    const tasks = JSON.parse(localStorage.getItem('tasks')) || []
    const task = tasks.find(t => t.id === id)
    if(task) {
      task.done = !task.done
      e.target.src = task.done ? './icon/done.png' : './icon/not.png'
      if(task.done) alert('good job!!')
      card.style.backgroundColor = task.done ? 'wheat' : 'blanchedalmond'
      h4.style.textDecoration = task.done ? 'line-through' : ''
      localStorage.setItem('tasks', JSON.stringify(tasks))
      renderTask()
    }
  }
})

function renderTask() {
  const tasks = JSON.parse(localStorage.getItem('tasks')) || []
  listTask.innerHTML = ''

  if(tasks.length === 0) {
    empty.style.display = 'block'
    return
  }
  empty.style.display = 'none'

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = {high: 1, medium: 2, low: 3}
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })

  sortedTasks.forEach(task => {
    listTask.innerHTML += addNewTask(task)
  });
}

function addNewTask(task) {
  return `<div class="card" style="background-color:${task.done ? 'wheat' : 'blanchedalmond'};" data-id="${task.id}">
    <div class="up">
      <img src="${task.done ? './icon/done.png' : './icon/not.png'}" class="check-list" alt="check list">
      <h4 class="title" style="text-decoration:${task.done ? 'line-through' : ''};">${task.title}</h4>
      <img src="./icon/dropdown.png" class="drop" alt="drop">
      <img src="./icon/edit.png" class="edit" alt="edit">
      <img src="./icon/delete.png" class="delete" alt="delete">
    </div>
    <div class="bottom">
      <p class="priority">${task.priority}</p>
      <p class="deadline">${task.deadline}</p>
    </div>
    <p class="opt show">${task.opt}</p>
  </div>`
};

function editTask(task) {
  return `<div>
            <p>Task Title</p>
            <input type="text" class="edit-keyword" placeholder="Add new task" value="${task.title}"/>
            
            <p>Details (optional)</p>
            <input type="text" class="edit-opt" placeholder="Details for task title" value="${task.opt || ''}"/>
          </div>
          <div class="edit-option">
            <div class="edit-priority">
              <p>Priority</p>
              <select id="edit-priority">
                <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
              </select> 
            </div>
            <div class="edit-deadline">
              <p>Deadline</p>
              <input type="date" class="edit-date" ${task.deadline || ''} />
            </div> 
          </div>
          <div class="edit-button">
            <button class="button-save">Save</button>
            <button class="button-edit-cancel" >Cancel</button>
          </div>`
}

function resetForm() {
  document.querySelector('.input-keyword').value = ''
  document.querySelector('.input-opt').value = ''
  document.querySelector('#priority').value = 'low'
  document.querySelector('.due-date').value = ''
}