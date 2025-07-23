let tododisplay=document.querySelector('.todo-display');
let taskinput=document.querySelector('.task-input');
let button=document.querySelector('.add-btn');

button.addEventListener('click',addTodo);

let ctr=1

function addTodo(){
    let taskwrapper=document.createElement('div');
    taskwrapper.setAttribute('id',`todo-${ctr}`);
    
    let task=document.createElement('h3');
    let deletbtn=document.createElement('button');
    let index=ctr;
    deletbtn.addEventListener('click',()=>deleteTodo(index));

    task.innerHTML=taskinput.value;
    deletbtn.innerHTML='DELETE';

    tododisplay.appendChild(taskwrapper);
    taskwrapper.appendChild(task);
    taskwrapper.appendChild(deletbtn);

    taskinput.value=''
    ctr=ctr+1;

}
function deleteTodo(index){
    let element=document.getElementById(`todo-${index}`);
    element.parentNode.removeChild(element);

}