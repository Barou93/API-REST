//Imports dependence
const express = require('express');

const bodyParser = require('body-parser');
const apiRouter = require('./apiRouter').router;

// Instantiate server

const server = express();

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());

server.use('/api/', apiRouter);

//Configure routes
server.get('/', (req, res, next) => {
    res.setHeader('Content-Type', 'text/html');
    res.status(200).send('<h1> Bienvenue sur mon super serveur </h1>');
})

//Lauch server

server.listen(8080, () => {
    console.log('Serveur en écoute !');
})