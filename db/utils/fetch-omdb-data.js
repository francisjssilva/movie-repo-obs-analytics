// Fetch OMDB data for all movies and TV shows from list.js
const https = require('https');
const fs = require('fs');

const OMDB_API_KEY = '92923783';
const RATE_LIMIT_DELAY = 10; // 250ms between requests to respect rate limit

// Read and parse list.js
const listContent = fs.readFileSync('./list.js', 'utf8');
const moviesMatch = listContent.match(/"movies":\s*\[([\s\S]*?)\]/);
const tvShowsMatch = listContent.match(/"tvShows":\s*\[([\s\S]*?)\]/);

let moviesData = { movies: [], tvShows: [] };

if (moviesMatch) {
    const moviesStr = '[' + moviesMatch[1] + ']';
    moviesData.movies = JSON.parse(moviesStr);
}

if (tvShowsMatch) {
    const tvShowsStr = '[' + tvShowsMatch[1] + ']';
    moviesData.tvShows = JSON.parse(tvShowsStr);
}

// Helper function to fetch from OMDB
function fetchOMDB(title, year) {
    return new Promise((resolve, reject) => {
        const url = `https://www.omdbapi.com/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&y=${year}&plot=full`;
        
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.Response === 'True') {
                        resolve(json);
                    } else {
                        console.error(`Error fetching ${title} (${year}): ${json.Error}`);
                        resolve(null);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// Helper to delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse runtime to integer
function parseRuntime(runtime) {
    if (!runtime || runtime === 'N/A') return null;
    const match = runtime.match(/\d+/);
    return match ? parseInt(match[0]) : null;
}

// Parse rating to float
function parseRating(rating) {
    if (!rating || rating === 'N/A') return null;
    const parsed = parseFloat(rating);
    return isNaN(parsed) ? null : parsed;
}

// Parse seasons to integer
function parseSeasons(seasons) {
    if (!seasons || seasons === 'N/A') return null;
    const parsed = parseInt(seasons);
    return isNaN(parsed) ? null : parsed;
}

// Escape single quotes for SQL
function escapeSql(str) {
    if (!str || str === 'N/A') return null;
    return str.replace(/'/g, "''");
}

// Main function
async function generateSQL() {
    console.log('Starting OMDB data fetch...\n');
    
    const movieInserts = [];
    const tvInserts = [];
    
    // Fetch movie data
    console.log('Fetching movie data...');
    for (const movie of moviesData.movies) {
        console.log(`Fetching: ${movie.title} (${movie.year})`);
        const omdbData = await fetchOMDB(movie.title, movie.year);
        await delay(RATE_LIMIT_DELAY);
        
        if (omdbData) {
            const title = escapeSql(movie.title);
            const year = movie.year.toString();
            const genre = escapeSql(omdbData.Genre);
            const rating = parseRating(omdbData.imdbRating);
            const description = escapeSql(omdbData.Plot);
            const poster = omdbData.Poster && omdbData.Poster !== 'N/A' ? omdbData.Poster : movie.poster;
            const director = escapeSql(omdbData.Director);
            const actors = escapeSql(omdbData.Actors);
            const runtime = parseRuntime(omdbData.Runtime);
            const rated = escapeSql(omdbData.Rated);
            const imdbId = omdbData.imdbID;
            
            movieInserts.push(
                `('${title}', '${year}', '${genre}', ${rating}, '${description}', '${poster}', '${director}', '${actors}', ${runtime}, '${rated}', '${imdbId}')`
            );
        }
    }
    
    // Fetch TV show data
    console.log('\nFetching TV show data...');
    for (const show of moviesData.tvShows) {
        const yearStr = String(show.year);
        const yearMatch = yearStr.match(/\d{4}/);
        const year = yearMatch ? yearMatch[0] : yearStr;
        
        console.log(`Fetching: ${show.title} (${year})`);
        const omdbData = await fetchOMDB(show.title, year);
        await delay(RATE_LIMIT_DELAY);
        
        if (omdbData) {
            const title = escapeSql(show.title);
            const yearStr = year.toString();
            const genre = escapeSql(omdbData.Genre);
            const rating = parseRating(omdbData.imdbRating);
            const description = escapeSql(omdbData.Plot);
            const poster = omdbData.Poster && omdbData.Poster !== 'N/A' ? omdbData.Poster : show.poster;
            const director = escapeSql(omdbData.Director || omdbData.Writer); // TV shows often have writers instead
            const actors = escapeSql(omdbData.Actors);
            const runtime = parseRuntime(omdbData.Runtime);
            const rated = escapeSql(omdbData.Rated);
            const imdbId = omdbData.imdbID;
            const seasons = parseSeasons(omdbData.totalSeasons);
            
            tvInserts.push(
                `('${title}', '${yearStr}', '${genre}', ${rating}, '${description}', '${poster}', '${director}', '${actors}', ${runtime}, '${rated}', '${imdbId}', ${seasons})`
            );
        }
    }
    
    // Generate SQL file
    console.log('\nGenerating SQL file...');
    
    const sql = `-- Populate Full Data from OMDB for All Entries
-- This script inserts complete movie and TV show data with all OMDB information
-- Run this in Supabase SQL Editor (replace existing seed.sql data)

-- Clear existing data (optional - comment out if you want to keep existing data)
-- TRUNCATE TABLE movies RESTART IDENTITY CASCADE;
-- TRUNCATE TABLE tv_shows RESTART IDENTITY CASCADE;

-- Insert Movies with Full OMDB Data
INSERT INTO movies (title, year, genre, imdb_rating, description, poster_url, director, actors, runtime, rated, imdb_id) VALUES
${movieInserts.join(',\n')};

-- Insert TV Shows with Full OMDB Data
INSERT INTO tv_shows (title, year, genre, imdb_rating, description, poster_url, director, actors, runtime, rated, imdb_id, seasons) VALUES
${tvInserts.join(',\n')};

SELECT 'All movies and TV shows have been inserted with full OMDB data!' as status;
`;
    
    fs.writeFileSync('./db/populate-full-data.sql', sql);
    console.log('\n✓ SQL file generated: db/populate-full-data.sql');
    console.log(`✓ ${movieInserts.length} movies and ${tvInserts.length} TV shows processed`);
}

// Run the script
generateSQL().catch(console.error);
