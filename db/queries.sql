-- CineHub Useful SQL Queries
-- Common queries for your application

-- ==========================================
-- BASIC QUERIES
-- ==========================================

-- Get all movies
SELECT * FROM movies ORDER BY title;

-- Get all TV shows
SELECT * FROM tv_shows ORDER BY title;

-- Get all content (movies + TV shows)
SELECT * FROM all_content ORDER BY title;

-- ==========================================
-- FILTERING QUERIES
-- ==========================================

-- Get movies by genre
SELECT * FROM movies 
WHERE genre LIKE '%Horror%' 
ORDER BY imdb_rating DESC;

-- Get movies by year
SELECT * FROM movies 
WHERE year = 2022 
ORDER BY imdb_rating DESC;

-- Get movies by rating range
SELECT * FROM movies 
WHERE imdb_rating >= 8.0 
ORDER BY imdb_rating DESC;

-- Get movies by runtime
SELECT * FROM movies 
WHERE runtime >= 120 
ORDER BY runtime DESC;

-- Get movies by director
SELECT * FROM movies 
WHERE director LIKE '%Nolan%' 
ORDER BY year DESC;

-- Search movies by title
SELECT * FROM movies 
WHERE title ILIKE '%dark%' 
ORDER BY title;

-- ==========================================
-- ADVANCED FILTERING
-- ==========================================

-- Multiple genres (OR condition)
SELECT * FROM movies 
WHERE genre LIKE '%Horror%' 
   OR genre LIKE '%Thriller%'
ORDER BY imdb_rating DESC;

-- Multiple filters (AND condition)
SELECT * FROM movies 
WHERE year >= 2020 
  AND imdb_rating >= 7.0 
  AND genre LIKE '%Horror%'
ORDER BY imdb_rating DESC;

-- Actor search
SELECT * FROM movies 
WHERE actors LIKE '%DiCaprio%'
ORDER BY year DESC;

-- ==========================================
-- SORTING QUERIES
-- ==========================================

-- Sort by title A-Z
SELECT * FROM movies ORDER BY title ASC;

-- Sort by title Z-A
SELECT * FROM movies ORDER BY title DESC;

-- Sort by rating (highest first)
SELECT * FROM movies ORDER BY imdb_rating DESC NULLS LAST;

-- Sort by rating (lowest first)
SELECT * FROM movies ORDER BY imdb_rating ASC NULLS LAST;

-- Sort by year (newest first)
SELECT * FROM movies ORDER BY year DESC;

-- Sort by year (oldest first)
SELECT * FROM movies ORDER BY year ASC;

-- ==========================================
-- STATISTICS QUERIES
-- ==========================================

-- Count total movies
SELECT COUNT(*) as total_movies FROM movies;

-- Count total TV shows
SELECT COUNT(*) as total_tv_shows FROM tv_shows;

-- Average rating
SELECT 
    ROUND(AVG(imdb_rating)::numeric, 2) as avg_rating
FROM movies 
WHERE imdb_rating IS NOT NULL;

-- Count by genre
SELECT 
    TRIM(regexp_split_to_table(genre, ',')) as genre,
    COUNT(*) as count
FROM movies
GROUP BY TRIM(regexp_split_to_table(genre, ','))
ORDER BY count DESC;

-- Count by year
SELECT 
    year,
    COUNT(*) as count
FROM movies
GROUP BY year
ORDER BY year DESC;

-- Top rated movies
SELECT title, imdb_rating, year
FROM movies
WHERE imdb_rating IS NOT NULL
ORDER BY imdb_rating DESC
LIMIT 10;

-- ==========================================
-- API ENDPOINT QUERIES
-- ==========================================

-- Get movies with pagination
SELECT * FROM movies 
ORDER BY title
LIMIT 20 OFFSET 0;  -- Change OFFSET for pages (0, 20, 40, etc.)

-- Get movie by ID
SELECT * FROM movies WHERE id = 1;

-- Get unique genres (for filter dropdown)
SELECT DISTINCT TRIM(regexp_split_to_table(genre, ',')) as genre
FROM movies
ORDER BY genre;

-- Get unique directors (for filter dropdown)
SELECT DISTINCT director
FROM movies
WHERE director IS NOT NULL AND director != 'N/A'
ORDER BY director;

-- Get unique actors (for filter dropdown)
SELECT DISTINCT TRIM(regexp_split_to_table(actors, ',')) as actor
FROM movies
WHERE actors IS NOT NULL AND actors != 'N/A'
ORDER BY actor
LIMIT 100;  -- Limit to avoid too many results

-- ==========================================
-- FULL-TEXT SEARCH
-- ==========================================

-- Search across title, description, director, actors
SELECT * FROM movies
WHERE 
    title ILIKE '%search_term%' OR
    description ILIKE '%search_term%' OR
    director ILIKE '%search_term%' OR
    actors ILIKE '%search_term%'
ORDER BY imdb_rating DESC;

-- ==========================================
-- INSERT/UPDATE QUERIES
-- ==========================================

-- Add new movie
INSERT INTO movies (
    title, year, genre, imdb_rating, description, 
    poster_url, trailer_url, director, actors, runtime, rated, imdb_id
) VALUES (
    'Movie Title',
    2024,
    'Action, Thriller',
    7.5,
    'Movie description here',
    'https://poster-url.com/image.jpg',
    'https://youtube.com/embed/trailer',
    'Director Name',
    'Actor 1, Actor 2',
    120,
    'PG-13',
    'tt1234567'
);

-- Update movie
UPDATE movies 
SET 
    imdb_rating = 8.0,
    description = 'Updated description'
WHERE id = 1;

-- Delete movie
DELETE FROM movies WHERE id = 1;

-- ==========================================
-- MAINTENANCE QUERIES
-- ==========================================

-- Check database size
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as db_size;

-- Check table sizes
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Vacuum and analyze (optimize)
VACUUM ANALYZE movies;
VACUUM ANALYZE tv_shows;

-- Reset auto-increment
SELECT setval('movies_id_seq', (SELECT MAX(id) FROM movies));
SELECT setval('tv_shows_id_seq', (SELECT MAX(id) FROM tv_shows));
