create table competencia (
	id int(11) not null auto_increment primary key,
	nombre varchar(100) not null
);

INSERT INTO `competencia` (`id`, `nombre`)
VALUES
	(1,'que pelicula te gusto mas?'),
	(2,'Que protagonista actuo mejor?'),
	(3,'Mejor banda sonora?'),
	(4,'Que pelicula te divirtio mas?');

alter table competencia add column (
	genero_id int(11) ,
	director_id int(11),
	actor_id int(11) ,
	deleted boolean not null default 0 
	);