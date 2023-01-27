const express = require("express");
const http = require("http");
//const socketIo = require("socket.io");

/*
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();

const io = new Server(httpServer, {
  cors: {
    origin: "https://example.com"
  }
});
*/

const fs = require("fs");
const { join } = require("path");
const dotenv = require("dotenv");
const envConfig = dotenv.parse(fs.readFileSync(join(__dirname, "../.env")));

for (const k in envConfig) {
  process.env[k] = envConfig[k];
}

//console.log("ENV ", process.env);
const port = process.env.REACT_APP_MOCKUP_SERVER_PORT || 4001;
const routes = require("./routes");

const app = express();
app.use(routes);

const server = http.createServer(app);

//const io = socketIo(server);

const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});
/*
// disable all CORS
const io = require("socket.io")(server, {
  allowRequest: (req, callback) => {
    const noOriginHeader = req.headers.origin === undefined;
    callback(null, noOriginHeader);
  }
});
*/

app.set('io', io);

let interval;

io.on("connection", (socket) => {
  console.log("New client connected ", new Date());
  if (interval) {
    clearInterval(interval);
  }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected ", new Date());
    //clearInterval(interval);
  });

});

const getApiAndEmit = socket => {
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));