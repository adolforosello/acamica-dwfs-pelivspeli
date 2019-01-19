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
app.get('/competencias/:id',controller.listCompetencias);
app.delete('/competencias/:id',controller.deleteCompetencias);
app.put('/competencias/:id',controller.modifCompetencias);
app.get('/competencias/:id/peliculas',controller.getOptions);
app.post('/competencias/:idCompetencia/voto',controller.addVote);
app.get('/competencias/:id/resultados',controller.getResults);
app.get('/generos',controller.getGeneros);
app.get('/directores',controller.getDirectores);
app.get('/actores',controller.getActores);
app.post('/competencias',controller.addCompetencia);
app.delete('/competencias/:idCompetencia/votos',controller.deleteVotes);
var port = '8080';

app.listen(port, function(){
	console.log('listen port ' + port);
});
