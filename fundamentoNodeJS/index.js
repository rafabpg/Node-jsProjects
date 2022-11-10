const express = require('express');
const app  =express();


app.use(express.json());
//localhost:3031
//
// app.get("/",(request,response)=>{
//     return response.send("Hello World!");//mensagem na tela
// })

// app.get("/",(request,response)=>{
//         return response.json({message:"hello World Ignite"});
// })
app.get("/courses",(request,response)=>{
        const query = request.query;
        console.log(query);
        return response.json(["Curso 01","curso 02","curso 03"]);
})
app.post("/courses",(request,response)=>{
        const body = request.body;
        console.log(body);
        return response.json(["Curso 01","curso 02","curso 03","curso 04"]);
})
app.put("/courses/:id",(request,response)=>{
        const params = request.params;
        console.log(params);
        return response.json(["Curso 06","curso 02","curso 03","curso 04"]);
})
app.delete("/courses/:id",(request,response)=>{
        return response.json(["curso 02","curso 03","curso 04"]);

})
app.listen(3333);