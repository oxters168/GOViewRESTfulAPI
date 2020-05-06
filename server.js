const http = require('http');
const app = require('./app');
console.log(require('dotenv').config());

const port = process.env.PORT || 3154;

const server = http.createServer(app);

server.listen(port);