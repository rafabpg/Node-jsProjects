const express = require('express');
const app = express();
const {v4: uuidV4} = require('uuid');

app.use(express.json());
const customers = [];

function getBalance(statement){
    const balance = statement.reduce((acc,operation)=>{
        if(operation.type === 'credit') return acc + operation.amount;
        else{return acc -operation.amount}
    },0);
    return balance;
}

function verifyExistCpf(request,response,next){
    const {cpf} = request.headers;
      
    const customer = customers.find(customer=> customer.cpf === cpf);
    if(!customer) return response.status(400).json({erro:"foi mal ta aerrado ai"});
    request.customer = customer; //todos que tiverem acesso a esse midleware terao acesso ao customer
    return next();
}

app.post("/account",(request,response)=>{
    const {cpf,name} = request.body;
    const customerExist = customers.some((customer)=> customer.cpf === cpf);
    if(customerExist) return response.status(400).json({error:"customer already exists"});
    customers.push({
        cpf,
        name,
        id:uuidV4(),
        statement:[]
    });
    return response.status(201).send();
});

app.post("/deposit",verifyExistCpf,(request,response)=>{
    const {description,amount} = request.body;
    const {customer} = request;
    const statementOperation = {
        description,
        amount,
        creat_at:new Date(),
        type:"credit"
    }
    customer.statement.push(statementOperation);
    return response.status(201).send();
})

app.post("/withdraw",verifyExistCpf,(request,response)=>{
    const {amount} = request.body;
    const {customer} = request;
    const balance = getBalance(customer.statement);
    if(balance < amount) return response.status(400).json({error:"sem saldo"});

    const statementOperation = {
        amount,
        creat_at:new Date(),
        type:"debit"
    }
    customer.statement.push(statementOperation);
    return response.status(201).send();

})
// app.use(verifyExistCpf);//quando todas as rotas para baixo tem que ter essa verificção e melhor usar esse jeito

app.get("/statement",verifyExistCpf,(request,response)=>{
    const { customer } = request;
    // const {cpf} = request.params;
    // const {cpf} = request.headers;
    
    // const customer = customers.find(customer=> customer.cpf === cpf);
    // if(!customer) return response.status(400);
    return response.json(customer.statement);
    // if(customer) return response.status(200).json({cpf:customer.cpf})
});

app.get("/statement/date",verifyExistCpf,(request,response)=>{
    const { customer } = request;
    const { date } = request.query;
    // const {cpf} = request.params;
    // const {cpf} = request.headers;
    const dateFormat = new Date(date + " 00:00");
    const statement = customer.statement.filter((statement)=>{
        statement.creat_at.toDateString() === new Date(dateFormat.toDateString())
    })
    // const customer = customers.find(customer=> customer.cpf === cpf);
    // if(!customer) return response.status(400);
    return response.json(statement);
    // if(customer) return response.status(200).json({cpf:customer.cpf})
});

app.put("/account",verifyExistCpf,(request,response)=>{
    const {name} = request.body;
    const { customer } = request;
    customer.name = name;
    return response.status(201).send();
  
});

app.get("/account",verifyExistCpf,(request,response)=>{
    const { customer } = request;
    // const customer = customers.find(customer=> customer.cpf === cpf);
    // if(!customer) return response.status(400);
    return response.json(customer);
    // if(customer) return response.status(200).json({cpf:customer.cpf})
});
app.delete("/account",verifyExistCpf,(request,response)=>{
    const { customer } = request;
    // const customer = customers.find(customer=> customer.cpf === cpf);
    // if(!customer) return response.status(400);
    customers.splice(customer,1);
    return response.status(200).json(customers);
    // if(customer) return response.status(200).json({cpf:customer.cpf})
});
app.get("/balance",verifyExistCpf,(request,response)=>{
    const { customer } = request;
    // const customer = customers.find(customer=> customer.cpf === cpf);
    // if(!customer) return response.status(400);
    const balance = getBalance(customer.statement);
    return response.json(balance);
    // if(customer) return response.status(200).json({cpf:customer.cpf})
});


app.listen(3333);