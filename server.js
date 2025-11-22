// Serveur de signalisation WebRTC simple
const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 8080 });

let clients = {};

console.log("Serveur de signalisation démarré sur ws://localhost:8080");

wss.on("connection", ws => {
    
    ws.on("message", message => {
        let data = JSON.parse(message);

        if (data.type === "register") {
            clients[data.username] = ws;
            console.log("Utilisateur connecté :", data.username);
            return;
        }

        if (data.to && clients[data.to]) {
            clients[data.to].send(JSON.stringify(data));
        }
    });

    ws.on("close", () => {
        for (let name in clients) {
            if (clients[name] === ws) {
                delete clients[name];
                console.log("Utilisateur déconnecté :", name);
                break;
            }
        }
    });
});
