-- CineHub Database Schema
-- PostgreSQL Database Setup

-- Drop tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS movies CASCADE;
DROP TABLE IF EXISTS tv_shows CASCADE;

-- Create movies table
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    year VARCHAR(60),
    genre VARCHAR(255) NOT NULL,
    imdb_rating DECIMAL(3,1),
    description TEXT,
    poster_url TEXT,
    trailer_url TEXT,
    director VARCHAR(100),
    actors TEXT,
    runtime INTEGER, -- in minutes
    rated VARCHAR(10),
    imdb_id VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tv_shows table
CREATE TABLE tv_shows (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    year VARCHAR(60),
    genre VARCHAR(100) NOT NULL,
    imdb_rating DECIMAL(3,1),
    description TEXT,
    poster_url TEXT,
    trailer_url TEXT,
    director VARCHAR(100),
    actors TEXT,
    runtime INTEGER, -- in minutes per episode
    rated VARCHAR(10),
    imdb_id VARCHAR(20),
    seasons INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_movies_year ON movies(year);
CREATE INDEX idx_movies_imdb_rating ON movies(imdb_rating);
CREATE INDEX idx_movies_genre ON movies(genre);

CREATE INDEX idx_tv_shows_title ON tv_shows(title);
CREATE INDEX idx_tv_shows_year ON tv_shows(year);
CREATE INDEX idx_tv_shows_imdb_rating ON tv_shows(imdb_rating);
CREATE INDEX idx_tv_shows_genre ON tv_shows(genre);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_movies_updated_at
    BEFORE UPDATE ON movies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tv_shows_updated_at
    BEFORE UPDATE ON tv_shows
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for all content (movies + tv shows)
CREATE VIEW all_content AS
    SELECT 
        'movie' as content_type,
        id,
        title,
        year,
        genre,
        imdb_rating,
        description,
        poster_url,
        trailer_url,
        director,
        actors,
        runtime,
        rated,
        imdb_id
    FROM movies
    UNION ALL
    SELECT 
        'tv_show' as content_type,
        id,
        title,
        year,
        genre,
        imdb_rating,
        description,
        poster_url,
        trailer_url,
        director,
        actors,
        runtime,
        rated,
        imdb_id
    FROM tv_shows;
