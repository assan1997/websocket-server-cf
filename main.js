const express = require('express');
const http = require('http');
const cors = require('cors');
const apiRoute = require('./api/index');
const db = require('./config/db');
const websocket = require('ws');
const app = express();
app.use(cors());


app.use('/api', apiRoute);

const httpServer = http.createServer(app);

// connexion à la base de données
db();

// websocket

const wss = new websocket.Server({ server: httpServer });
wss.on('connection', (ws, request) => {
    console.log('user connected');
});

httpServer.listen(5000, () => { console.log('listenning on port 5000') });
