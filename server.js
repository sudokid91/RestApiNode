// const express = require('express');
const http = require('http');

const app = require('./app');

const port = process.env.PORT || 6969;

const server = http.createServer(app);
// const app = express();

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});
// app.listen(port, () => {
//     console.log(`server is running on port ${port}`);
// })
