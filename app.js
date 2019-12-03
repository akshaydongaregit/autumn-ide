const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname + '/src/views'));

var port = process.env.PORT || 8080;

app.use('/resources', express.static('src/resources'));
//app.use(session({ secret: 'autumn@123' }));
app.use(bodyParser.json());

app.use('/ide',require('./src/routers/ide'));
app.use('/repo',require('./src/routers/repo'));

server.listen(port,() => console.log('Server started on port '+port) );