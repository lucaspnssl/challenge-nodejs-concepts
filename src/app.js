const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function getReposIndexByID(id) {
  return repositories.findIndex(repos => repos.id === id);
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

    const repos = { id: uuid(), title, url, techs, likes: 0 };

    repositories.push(repos);
    return response.json(repos);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = getReposIndexByID(id);

  if (index < 0)
    return response.status(400).json({ error: 'Repository not found.'});

  const repos = {
    id,
    title,
    url,
    techs,
    likes: repositories[index].likes
  };

  return response.json(repos); 
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = getReposIndexByID(id);

  if (index < 0)
    return response.status(400).json({ error: 'Repository not found.' });

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = getReposIndexByID(id);

  if (index < 0)
    return response.status(400).json({ error: 'Repository not found.' });

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
