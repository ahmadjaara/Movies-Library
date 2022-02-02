DROP TABLE IF EXISTS MoviesLibrary;

CREATE TABLE IF NOT EXISTS MoviesLibrary (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR(255),
    poster_path VARCHAR(255),
    overview VARCHAR(10000)

)