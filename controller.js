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

module.exports = {
	listCompetencias : listCompetencias,
	getOptions : getOptions
}