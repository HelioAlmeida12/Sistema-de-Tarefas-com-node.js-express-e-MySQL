const API_URL = 'http://localhost:3000/tasks';

const taskForm = document.getElementById('taskForm');
const pendingTasks = document.getElementById('pendingTasks');
const completedTasks = document.getElementById('completedTasks');

//CARREGAR TAREFAS TASKS
async function loadTasks(){

    pendingTasks.innerHTML = '';
    completedTasks.innerHTML = '';

    const res =   await fetch(API_URL);
    const tasks = await res.json();

    tasks.forEach(task =>{
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : "";
    li.innerHTML = `
        <span>${task.description}</span>
        <div>
        ${
            task.completed
            ? `
            <button class="action toggle" onclick="toggleTask(${task.id}, ${task.completed})" >Reabrir</button>
            <button class="action delete" onclick="deleteTask(${task.id})" >Excluir</button>
            `
            :`
             <button class="action toggle" onclick="toggleTask(${task.id}, ${task.completed})" >Concluir</button>
            <button class="action edit" onclick="editTask(${task.id}, '${task.description}')"> Editar</button>
             <button class="action delete" onclick="deleteTask(${task.id})" >Excluir</button>
             `
        }          
        </div>    
    `;
    if(task.completed){
        completedTasks.appendChild(li);
    }else{
        pendingTasks.appendChild(li);
    }
 
    })    
}


//EDITAR TASKS

async function editTask(id, currentDescription){

    const newDesc = prompt('Editar descricao:', currentDescription);
    if(newDesc && newDesc.trim() !== ""){

        await fetch(`${API_URL}/${id}`,{

            method: "PUT",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({description: newDesc, completed: false})
        })
    }
     loadTasks();

}

//REABRIR
async function toggleTask(id, completed){
    
    const res = await fetch(API_URL);
    const tasks = await res.json();
    const task = tasks.find(t => t.id === id);

    if(!task) return;

    await fetch(`${API_URL}/${id}`, {

        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify( { description: task.description, completed: !completed})
    })
    loadTasks();

}

//EXCLUIR 
async function deleteTask(id){

    if(confirm('Deseja excluir esta tarefa? ')){

        await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        })

        loadTasks()

    }


}

//ADICIONAR TAREFA
taskForm.addEventListener('submit', async (e)=>{

    e.preventDefault();

    const description = document.getElementById('description').value;
    
    await fetch(API_URL,{

        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify( {description } )
    });

    taskForm.reset();
    loadTasks();
});



 loadTasks()






