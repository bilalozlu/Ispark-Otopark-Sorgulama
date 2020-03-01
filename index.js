const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var express = require('express');
var app = express();

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');

  var request=require('request');

  request.get('https://api.ibb.gov.tr/ispark/Park',async (request,response){
      try {
          const b = await response
          res.write(b);
      }
      catch {
      }
  });

  res.end();
});

app.use(express.static('public'));
app.listen(8080, () => {
  console.log('listening on 8080');
});


const request = require('request');





function getjsonlist(url)
{
  return new Promise((resolve,reject)=>
  {
    var options =
    {
      method:'GET'
     ,url: url
     ,agentOptions: {
        rejectUnauthorized: false
      }
     ,headers:
      {
      }

    };
    request(options,function(error,response,body)
    {
      if(error)
        reject(error);
      var bd = JSON.parse(body);
      resolve(bd);
    })
  })
}
