-- Active: 1733672158670@@127.0.0.1@5434@db_hito@public

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS movies_genres;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorites;

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(200) NOT NULL
);

-- Tabla de películas
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    release_year INT CHECK (release_year > 1800),
    director VARCHAR(100),
    duration_minutes INT,
    synopsis TEXT,
    poster_url TEXT
);

-- Tabla de géneros
CREATE TABLE genres (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Tabla puente: Películas y Géneros (N:M)
CREATE TABLE movies_genres (
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    PRIMARY KEY (movie_id, genre_id),
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres (id) ON DELETE CASCADE
);

-- Tabla de reseñas
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    movie_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);

-- Tabla de favoritos
CREATE TABLE favorites (
    user_id UUID NOT NULL,
    movie_id INT NOT NULL,
    PRIMARY KEY (user_id, movie_id),
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE
);



INSERT INTO users (email, password) VALUES
('test1@domain.com', '123123');

UPDATE users SET email = 'test1-update@domain.com' WHERE id = '1';

DELETE FROM users WHERE id = '1';

SELECT * FROM users;