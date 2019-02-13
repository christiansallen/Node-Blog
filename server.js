const express = require("express");
const postsRouter = require("./routers/posts-router.js");
const usersRouter = require("./routers/users-router.js");

const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);
server.use("/api/users", usersRouter);

server.get("/", (req, res) => {
  res.send("<h2>Node Blog</h2>");
});

module.exports = server;
