database = require('./dbConnect');

function listCompetencias(req,res){
	var query = 'select * from competencia';
	database.query(query,function(error,result,field){
		if(error){
			res.status(404).send('Hubo un error en la consulta ',error.message);
		}
		
		res.json(result);
		
	});
}

function getOptions(req,res){
	var query = 'select nombre from competencia where id ='+req.params.id+';';
	var query1 ='select * from pelicula where rand() limit 2';
	database.query(query,function(error,result,field){
		if(error){
			res.status(404).send('Hubo un error en la consulta ', error.message);
		}
		database.query(query1,function(error,result1,field){
			if(error){
				res.status(404).send('Hubo un error en la consulta ', error.message);
			}
			respuesta = {
				competencia : result[0].nombre,
				peliculas : [result1[0],result1[1]]
			}
			res.send(respuesta);
			
		});

	});
		
}

function addVote(req,res){

	var vote = req.body;
	var movie_id = vote.idPelicula;
	
	var query = 'INSERT INTO votos (competencia_id,pelicula_id) values (?,?)';
	database.query(query,[req.params.idCompetencia,movie_id],function(error,results,fields){
		if(error){
			res.status(404).send('Hubo un error en la consulta',error.message);
		}
		res.status(202).send('ok');
	});
}

function getResults(req,res){
	var query = ' select *, count(pelicula_id) as votos from votos v inner join competencia c on v.competencia_id = c.id  inner join pelicula p on p.id = v.pelicula_id where v.competencia_id = (?) group by v.pelicula_id order by votos DESC;';
	database.query(query,[req.params.id],function(error,results,fields){
		if(error){
			res.status(500).send("Hubo un error en la consulta!",error.message);
		}
		var respuesta = {
			competencia :results[0].nombre,
			resultados : results

		}
		res.send(respuesta);
		//res.send(respuesta.resultados[1].titulo);
	});
}	

module.exports = {
	listCompetencias : listCompetencias,
	getOptions : getOptions,
	addVote : addVote,
	getResults : getResults
}