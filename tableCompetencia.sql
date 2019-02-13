create table competencia (
	id int(11) not null auto_increment primary key,
	nombre varchar(100) not null,
	genero_id int(11) ,
	director_id int(11),
	actor_id int(11) ,
	deleted boolean not null default 0 
);

INSERT INTO `competencia` (`id`, `nombre`,`genero_id`,`director_id`,`actor_id`,`deleted`)
VALUES
	(1,'que pelicula te gusto mas?',0,0,0,0),
	(2,'Que protagonista actuo mejor?',0,0,0,0),
	(3,'Mejor banda sonora?',0,0,0,0),
	(4,'Que pelicula te divirtio mas?',0,0,0,0);
