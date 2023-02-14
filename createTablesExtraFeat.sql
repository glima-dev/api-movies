CREATE DATABASE m4_sp2_movies_extras;

CREATE TABLE IF NOT EXISTS movies(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(50) UNIQUE NOT NULL,
	description TEXT DEFAULT NULL,
	duration INTEGER NOT NULL,
	categories VARCHAR(50) ARRAY NOT NULL,
	discount INTEGER NOT NULL DEFAULT 0,
	stock INTEGER NOT NULL DEFAULT 0,
	price INTEGER NOT NULL,
	CHECK ("price" > 0)
);

/*
 * O ARRAY PASSADO RECEBERÁ VÁRIOS VALORES DE UMA VEZ
 * O POSTGRES IDENTIFICA VÁRIOS VALORES DE UMA VEZ SÓ ATRAVÉS
 * DA SEGUINTE SINTAXE: '{Drama, Suspense}' COM CHAVES E NÃO COM COLCHETES
 * ABAIXO, UM EXEMPLO DE INSERÇÃO:
 *  */
INSERT INTO
	movies(
		name,
		description,
		duration,
		price,
		categories,
		discount,
		stock
	)
VALUES
	(
		'One Piece',
		'O melhor filme que você assistirá na vida',
		124,
		1200,
		'{Drama, Aventura}',
		DEFAULT,
		DEFAULT
	),
	(
		'Naruto',
		'O segundo melhor filme que você assistirá na vida',
		80,
		120,
		'{Aventura, Suspense}',
		DEFAULT,
		DEFAULT
	),
	(
		'Dragon Ball Super',
		'O terceiro melhor filme que você assistirá na vida',
		68,
		300,
		'{Aventura, Comédia}',
		DEFAULT,
		DEFAULT
	),
	(
		'Senhor dos Anéis',
		'O quarto melhor filme que você assistirá na vida',
		180,
		250,
		'{Drama, Aventura}',
		DEFAULT,
		DEFAULT
	),
	(
		'Peles',
		'O quinto melhor filme que você assistirá na vida',
		90,
		20,
		'{Ação, Suspense}',
		DEFAULT,
		DEFAULT
	),
	(
		'Berserk',
		'O sexto melhor filme que você assistirá na vida',
		92,
		550,
		'{Ação, Aventura, Terror}',
		DEFAULT,
		DEFAULT
	),
	(
		'A pantera cor de rosa',
		'O sétimo melhor filme que você assistirá na vida',
		95,
		1830,
		'{Comédia}',
		DEFAULT,
		DEFAULT
	),
	(
		'Filth',
		'O oitavo melhor filme que você assistirá na vida',
		112,
		400,
		'{Drama, Suspense}',
		DEFAULT,
		DEFAULT
	);

SELECT
	*
FROM
	movies;