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
let users = [];
wss.on('connection', (ws, request) => {
    console.log('user connected');

    ws.on("message", (msg) => {
        if (msg.includes("{") && msg.includes("}")) {
            msg = JSON.parse(msg);

            switch (msg.type) {
                case "getChats": {
                    ws.send(JSON.stringify({
                        type: msg.type,
                        id: msg.userId,
                        messages: [{
                            textContent: "Bonjour",
                            isSeen: true,
                            isSend: true,
                            senderId: 5,
                            time: new Date()
                        }]
                    }))
                }
                    break;
                case "logout": {
                    ws.send(JSON.stringify({
                        type: msg.type,
                        logout: true,
                        userId: msg.userId,
                        msg: "good bye"
                    }))
                }
                    break;
                case "sendMessage": {
                    wss.clients.forEach(c => {
                        if (c != ws && c.readyState == websocket.OPEN && c.$_id == msg.receiverId) {
                            c.send(JSON.stringify({
                                send_id: ws.$_id,
                                type: msg.type,
                                text: msg.text
                            }))
                        }
                    })
                }
                    break;
                case "newConnection": {
                    ws.$_id = msg.id
                    users.push(msg.id);
                    wss.clients.forEach(c => {
                        if (c != ws && c.readyState == websocket.OPEN) {
                            c.send(JSON.stringify({
                                type: "sendUserId",
                                userId: ws.$_id
                            }))
                        } else if (c.$_id === ws.$_id) {
                            let tab = users.filter(u => u != ws.$_id)
                            c.send(JSON.stringify({
                                type: "sendUserId",
                                userId: tab
                            }))
                        }
                    })
                }
                    break;

            }


        }


        console.log(msg);
    })

    ws.send(JSON.stringify({
        status: true,
        data: "client connected"
    }));

    ws.on("close", function () {
        users = users.filter(u => u != ws.$_id);
        console.log("client ", ws.$_id, " disconnect");

        wss.clients.forEach(c => {
            c.send(JSON.stringify({
                type: "disconnect",
                userId: ws.$_id
            }))
        })

    })
});

httpServer.listen(3000, () => { console.log('listenning on port 3000') });
