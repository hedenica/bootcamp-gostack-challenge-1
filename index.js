const express = require ('express');

const server = express();

server.use(express.json());

const projects = []

// Middleware de LOGS || Global 

server.use((request, response, next) => {
  console.time('⏳ Request')
  console.log(`Método: ${request.method} | URL: ${request.url}`)
  console.count(`♻ Total de Requisições`);

   next();

   console.timeEnd('⏳ Request')
})

// Middleware -> verifica se o projeto com aquele ID existe.Se não existir retorne um erro, caso contrário permita a requisição continuar normalmente.

function checkIfProjectExists(request, response, next) {

  const { id } = request.params;
  const project = projects.find(project => project.id == id);

  if(!project) {
    return response.status(400).json({ error: ' 🔍 Project not found' })
  }

  return next();
}

// POST /projects -> Cadastra um Projeto [sem tasks]

server.post('/projects', (request, response) => {
  const { id, title} = request.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return response.json(project);
  
})

//GET /projects: -> Rota que lista todos os projetos

server.get('/projects', (request, response) => {

  return response.json(projects);

})

//PUT /projects/:id -> A rota deve alterar apenas o 'título do projeto' com o 'id' presente nos parâmetros da rota

server.put('/projects/:id', checkIfProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(project => project.id == id);

  project.title = title;

  return response.json(project);

});

//DELETE /projects/:id -> A rota deve deletar o projeto com o id presente nos parâmetros da rota

server.delete('/projects/:id', checkIfProjectExists, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(project => project.id == id);

  projects.splice(projectIndex, 1);

  return response.send({message: "❌ Project Deleted"});

});

// POST /projects/:id/tasks -> A rota deve receber um campo title e armazenar uma nova tarefa no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;

server.post('/projects/:id/tasks', checkIfProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(project => project.id == id);

  project.tasks.push(title) 

  return response.json(project);
})


server.listen(3000);