
const hostname = '127.0.0.1';
const port = 3000;

const http = require('http');
var request = require("request");

http.createServer(function(req, response) {
  response.writeHead(200, {"Content-Type": "text/plain"});
    request('http://www.google.com', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body) // Print the google web page.
      }
    })
  response.end();
}).listen(8888);
