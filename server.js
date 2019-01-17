var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var controller = require('./controller');
var app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/competencias',controller.listCompetencias);
app.get('/competencias/:id/peliculas',controller.getOptions);
var port = '8080';

app.listen(port, function(){
	console.log('listen port ' + port);
});
