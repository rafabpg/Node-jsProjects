const express = require('express');
const app = express();
const {v4: uuidV4} = require('uuid')

app.use(express.json());
const users = [];

function verifyExistUsername(request,response,next){
    const {username} = request.headers;
    const userTodos = users.find(user => user.username === username);
    if(!userTodos) return response.status(400).json({erro:"foi mal ta errado ai"});
    request.userTodos = userTodos;
    return next();
}


app.post("/users",(request,response)=>{
    const {name,username}  = request.body;
    const userExist = users.some((user)=> user.username === username);
    if(userExist) return response.status(400).json({error:"user already exist"});
    users.push({
        id:uuidV4(),
        name,
        username,
        todos:[]
    });
    return response.status(200).send();
})

app.get("/todos",verifyExistUsername,(request,response)=>{
    const {user} = request;
    return response.json(user.todos);
})

app.post("/todos",verifyExistUsername,(request,response)=>{
    const {title,deadline} = body.params;
    const {userTodos} = request;
    const todosOperation = {
        id: uuidV4(), // precisa ser um uuid
        title,
        created_at: new Date(),
        deadline:new Date(deadline), 
        done: false, 
    }
    userTodos.todos.push(todosOperation);
    return response.status(201).send();
})

app.put("/todos/:id",verifyExistUsername,(request,response)=>{
    const {userTodos} = request;
    const {title,deadline} = body.params;
    const {id} = request.params;
    const todo = userTodos.todos.find(todo =>todo.id === id );
    if(!todo) return response.status(404).send();
    todo.title = title;
    todo.deadline = new Date(deadline);
    return response.status(201).json(todo);
})

app.patch("/todos/:id/done",verifyExistUsername,(request,response)=>{
    const {userTodos} = request;
    const {id} = request.params;
    const todo = userTodos.todos.find(todo =>todo.id === id );
    if(!todo) return response.status(404).send();
    todo.done = true;
    return response.status(201).json(todo);
})


app.delete("/todos/:id",verifyExistUsername,(request,response)=>{
    const {userTodos} = request;
    const {id} = request.params;
    const todoIndex = userTodos.todos.findIndex(todo =>todo.id === id );
    if(todoIndex == -1) return response.status(404).send();
    userTodos.todos.splice(todoIndex,1);
    return response.status(204);
})

app.listen(3333);