const http = require('http');
const app = require('./app');
require('dotenv').config();

const port = process.env.PORT || 3154;

const server = http.createServer(app);

server.listen(port);