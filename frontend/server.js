const http = require('http');

// Create a simple server
const hostname = '0.0.0.0';
const port = 3000;

const server = http.createServer((req, res) => {
    if(req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        serverHeader = "Hello world!";
        res.end(serverHeader);
    }
    else {
        res.statusCode = 405;
    }
});

server.listen(port, hostname, () => {
    console.log("Server running at http://"+hostname+":"+port+"/");
});
