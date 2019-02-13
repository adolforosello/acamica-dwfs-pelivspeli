database = require('./dbConnect');

function listCompetencias(req,res){
	var where = ' where 1 = 1 and deleted = 0';
	
	if (req.params.id) {
		var join = '';
		var select = '';
		where += ' and competencia.id = '+req.params.id;
		database.query('select * from competencia  '+where+';',function(error,results,fields){
			if (results[0].actor_id !=0) {
				select += ' ,actor.nombre as actor_nombre';
				join += ' inner join actor  on competencia.actor_id=actor.id ';
			}
			if (results[0].genero_id !=0 ) {
				select += ' ,genero.nombre as genero_nombre';
				join += ' inner join genero  on genero.id=competencia.genero_id ';
			}
			if (results[0].director_id !=0 ) {
				select += ' ,director.nombre as director_nombre ';
				join += ' inner join director  on competencia.director_id=director.id ';
			}
			var query = 'select competencia.nombre '+select+' from competencia  '+join+where+';';
			database.query(query,function(error,results,field){
				if(error){
					res.status(404).send('Hubo un error en la consulta ',error.message);
				}
				var resultado = {
					nombre : results[0].nombre,
					genero_nombre : results[0].genero_nombre,
					actor_nombre : results[0].actor_nombre,
					director_nombre : results[0].director_nombre
				}
			res.send(resultado);
			});
		});
		
	}else{
		var query = 'select c.nombre as nombre, c.id as id from competencia c where deleted = 0;';
		database.query(query,function(error,results,field){
		if(error){
			res.status(404).send('Hubo un error en la consulta ',error.message);
		}
		var resultado = [];
		results.forEach(function(element){

			resultado.push({
				id : element.id,
				nombre : element.nombre
			});
		})
		res.send(resultado);
	})
	}
}

function getOptions(req,res){
	var query = 'select nombre from competencia where id ='+req.params.id+';';
	database.query(query,function(error,result,field){
		if(error){
			res.status(404).send('Hubo un error en la consulta ', error.message);
		}
		var where = 'where rand() ';
		var query1 ='select * from pelicula '+where+' limit 2;';	
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
		res.send(results);
	});
}

function getResults(req,res){
	var query = ' select *, count(pelicula_id) as votos from votos v inner join competencia c on v.competencia_id = c.id  inner join pelicula p on p.id = v.pelicula_id where v.competencia_id = (?) group by v.pelicula_id order by votos DESC;';
	database.query(query,[req.params.id],function(error,results,fields){
		if(error){
			res.status(422).send("Hubo un error en la consulta!",error.message);
		}
		if (results==0) {
			res.send(results);		
		}else{
			var respuesta = {
				competencia :results[0].nombre,
				resultados : results
			}
			res.send(respuesta);	
		}
	});
}	

function getGeneros(req,res){
	var query = 'select * from genero';
	database.query(query,function(error,results,fields){
		if(error){
			res.status(500).send('Error de consulta a la base de datos',error.message);
		}
		res.send(results);
	});
}

function getActores(req,res){
	var query = 'select * from actor';
	database.query(query,function(error,results,fields){
		if(error){
			res.status(500).send('Error de consulta a la base de datos',error.message);
		}
		res.send(results);
	});
}

function getDirectores(req,res){
	var query = 'select * from director';
	database.query(query,function(error,results,fields){
		if(error){
			res.status(500).send('Error de consulta a la base de datos',error.message);
		}
		res.send(results);
	});
}

function addCompetencia(req,res){

	var nombre = req.body.nombre;
	var genero = req.body.genero;
	var director = req.body.director;
	var actor = req.body.actor;

	if (nombre==undefined || nombre == "") {
		res.send('Ingrese un nombre valido',422);
	}

	var queryValidationCompetencia = 'select nombre from competencia where nombre = "'+nombre+'";';
	database.query(queryValidationCompetencia,function(error,results,fields){
		if (results.length>0) {
			res.send("La competencia ya existe!",422);
		}

		var where = 'where 1 = 1 ';
		if (actor!=undefined && actor!=0) {
			where += ' and a.actor_id = '+actor;

		}
		if (genero!=undefined && genero!=0) {
			where += ' and genero_id = '+genero;
			 
		}
		if (director!=undefined && director!=0) {
			where += ' and d.director_id = '+director;
			 
		}
		var queryValidationPeli = 'select p.id from pelicula p inner join actor_pelicula a on a.pelicula_id = p.id inner join director_pelicula d on d.pelicula_id = p.id inner join genero on genero_id = p.genero_id '+where+';';
				
		database.query(queryValidationPeli,function(error,results1,fields){
			if (results1.length < 2) {
				res.send("La competencia no tiene peliculas que cumplan con todos los filtros!",422);
			}else{
				var query = 'INSERT INTO competencia (nombre,genero_id,director_id,actor_id) values(?,?,?,?)';
				database.query(query,[nombre,genero,director,actor],function(error,results2,fields){
					if (error) {
						res.status(500).send('Error de insercion de datos',error.message)
					}
					res.status(200).send(results2);
				});
			}
		});
		
	});
	
	
	
}

function deleteVotes(req,res){
	query = 'delete from votos where competencia_id = '+req.params.idCompetencia+';';
	queryValidation = 'select * from votos where competencia_id = '+req.params.idCompetencia+';';
	database.query(queryValidation,function(error,results,fields){
		if(results.length==0){
			res.send('La competencia no contiene votos para reiniciarce',422);
		}
		database.query(query,function(error,results1,fields){
			if (error) {
				res.status(500).send('Error de insercion de datos',error.message)
			}
			res.status(200).send(results1);
		});
	})
}

function deleteCompetencias(req,res){

	var queryVerification = 'select * from competencia where id = (?) and deleted = 0';
	database.query(queryVerification,[req.params.idCompetencia],function(error,results,fields){
		if(results<0){
			res.send("La competencia no puede ser eliminada",422);
		}
		var query = 'update competencia set deleted = 1 where id = '+req.params.id+';';
		database.query(query,function(error,results,fields){
			res.send(results);
			console.log(query)
		});
	}); 
}

function modifCompetencias(req,res){

	var queryVerification = 'select * from competencia where id = (?) and deleted = 0';
	database.query(queryVerification,[req.params.idCompetencia],function(error,results,fields){
		if(results<0){
			res.send("La competencia no puede ser editada",422);
		}
		var nombre = req.body.nombre;
		var query = 'update competencia set nombre = "'+nombre+'" where id = '+req.params.id+';';
		database.query(query,function(error,results,fields){
			res.send(results);
			console.log(query)
		});
	}); 
}
module.exports = {
	listCompetencias : listCompetencias,
	getOptions : getOptions,
	addVote : addVote,
	getResults : getResults,
	addCompetencia :addCompetencia,
	getDirectores : getDirectores,
	getActores : getActores,
	getGeneros : getGeneros,
	deleteVotes : deleteVotes,
	deleteCompetencias : deleteCompetencias,
	modifCompetencias : modifCompetencias
}