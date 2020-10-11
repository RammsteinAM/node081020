const http = require("http");
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require('uuid');
const port = 8080;

const app = express();

app.set('view engine', 'pug');
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(express.static(__dirname));
app.use(bodyParser.json());

const todos = [];

app.get("/", (req, res) => {
  res.render('index', { title: 'Todos', todos });
});

app.post("/create", (req, res, next) => {
  const todo = {
    id: uuidv4(),
    text: req.body.text
  };
  if(todo.id && todo.text) {
    todos.unshift(todo);
    res.status(201).redirect('/');
  }
  else {
    next({ status: 400, text: "Missing data." });
  }
});

app.get("/edit/:id", (req, res, next) => {
  const foundIndex = todos.findIndex(item => 
    item.id === req.params.id
  );
  if (foundIndex >= 0) {    
    res.render('edit', { title: 'Edit Item', item: todos[foundIndex] });
  }
  else {
    next({ status: 404 });
  }
});

app.post("/edit/:id", (req, res, next) => {
  const foundIndex = todos.findIndex(item => 
    item.id === req.params.id
  );
  if(todos[foundIndex] && req.body.text) {
    todos[foundIndex].text = req.body.text;
    res.status(204).redirect('/');
  }
  else {
    next({ status: 400, text: "Missing data." });
  }
});

app.delete("/delete/:id", (req, res, next) => {
  const foundIndex = todos.findIndex(item => 
    item.id === req.params.id
  );
  if (foundIndex >= 0) {
    todos.splice(foundIndex, 1);    
    res.sendStatus(204);
  }
  else {
    next({ status: 404 })
  }
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).render('error', err );
})

app.listen(port);