const http = require('http');

console.log("Program Started");
console.log(process.platform);
console.log(process.env.USER);



http.createServer((req, res) => {
}).listen(8080);
