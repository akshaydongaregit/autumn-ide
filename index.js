const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/view'));

var port = process.env.PORT || 8080;

app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/img', express.static('img'));
app.use('/codemirror', express.static('codemirror'));
app.use('/views', express.static('views'));

//app.use(session({ secret: 'autumn@123' }));
app.use(bodyParser.json());

server.listen(port,() => console.log('Server started on port '+port) );