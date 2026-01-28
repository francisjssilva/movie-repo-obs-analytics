// Database service for CineHub
// Direct connection to Supabase (no backend needed)

class DatabaseService {
    constructor() {
        // Supabase configuration
        // Replace these with your Supabase project URL and anon key
        this.supabaseUrl = 'https://lxnppwpxzrzmlmmxjphr.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4bnBwd3B4enJ6bWxtbXhqcGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2MTY4ODIsImV4cCI6MjA4NTE5Mjg4Mn0.orJ73hLg5X392mpe_sAcWKiAkX_n6pbZB2I9B4SWOA4';
        
        this.cache = new Map();
        this.cacheExpiration = 5 * 60 * 1000; // 5 minutes cache
        this.configured = false;
        
        // Check if configured
        if (this.supabaseUrl.includes('your-project') || this.supabaseKey.includes('your-anon-key')) {
            console.warn('⚠️ Supabase not configured!');
            console.log('📖 Setup instructions: See GITHUB_PAGES_SETUP.md');
            console.log('🔗 Get credentials from: https://supabase.com/dashboard/project/_/settings/api');
        } else {
            this.configured = true;
            console.log('✅ Supabase configured');
        }
    }

    // Check if Supabase is configured
    isConfigured() {
        return this.configured;
    }

    // Helper to make Supabase API requests
    async supabaseRequest(endpoint, options = {}) {
        const url = `${this.supabaseUrl}/rest/v1/${endpoint}`;
        const headers = {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation',
            ...options.headers
        };

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`Supabase API error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Fetch movies from database
    async getMovies() {
        if (!this.configured) {
            throw new Error('Supabase not configured. Please update db-service.js with your credentials.');
        }
        
        try {
            const cacheKey = 'movies';
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
                console.log('📦 Using cached movies');
                return cached.data;
            }

            console.log('🔄 Fetching movies from Supabase...');
            
            // Query movies table, order by title
            const movies = await this.supabaseRequest('movies?select=*&order=title.asc');
            
            // Transform database format to frontend format
            const transformedMovies = movies.map(movie => ({
                id: movie.id,
                title: movie.title,
                year: movie.year,
                genre: movie.genre,
                imdb: movie.imdb_rating,
                description: movie.description,
                poster: movie.poster_url,
                trailer: movie.trailer_url,
                director: movie.director,
                actors: movie.actors,
                runtime: movie.runtime,
                rated: movie.rated,
                imdbID: movie.imdb_id
            }));
            
            this.cache.set(cacheKey, {
                data: transformedMovies,
                timestamp: Date.now()
            });
            
            console.log(`✅ Loaded ${transformedMovies.length} movies from Supabase`);
            return transformedMovies;
        } catch (error) {
            console.error('❌ Error fetching movies:', error);
            throw error;
        }
    }

    // Fetch TV shows from database
    async getTVShows() {
        if (!this.configured) {
            throw new Error('Supabase not configured. Please update db-service.js with your credentials.');
        }
        
        try {
            const cacheKey = 'tvshows';
            const cached = this.cache.get(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
                console.log('📦 Using cached TV shows');
                return cached.data;
            }

            console.log('🔄 Fetching TV shows from Supabase...');
            
            // Query tv_shows table, order by title
            const tvShows = await this.supabaseRequest('tv_shows?select=*&order=title.asc');
            
            // Transform database format to frontend format
            const transformedTVShows = tvShows.map(show => ({
                id: show.id,
                title: show.title,
                year: show.year,
                genre: show.genre,
                imdb: show.imdb_rating,
                description: show.description,
                poster: show.poster_url,
                trailer: show.trailer_url,
                director: show.director,
                actors: show.actors,
                runtime: show.runtime,
                rated: show.rated,
                imdbID: show.imdb_id
            }));
            
            this.cache.set(cacheKey, {
                data: transformedTVShows,
                timestamp: Date.now()
            });
            
            console.log(`✅ Loaded ${transformedTVShows.length} TV shows from Supabase`);
            return transformedTVShows;
        } catch (error) {
            console.error('❌ Error fetching TV shows:', error);
            throw error;
        }
    }

    // Search across movies and TV shows
    async search(query) {
        try {
            console.log(`🔍 Searching for: ${query}`);
            
            // Search in movies
            const movies = await this.supabaseRequest(
                `movies?or=(title.ilike.*${query}*,description.ilike.*${query}*,director.ilike.*${query}*,actors.ilike.*${query}*)&select=*`
            );
            
            // Search in TV shows
            const tvShows = await this.supabaseRequest(
                `tv_shows?or=(title.ilike.*${query}*,description.ilike.*${query}*,director.ilike.*${query}*,actors.ilike.*${query}*)&select=*`
            );
            
            return {
                movies: movies.map(m => ({ ...m, type: 'movie' })),
                tvShows: tvShows.map(s => ({ ...s, type: 'tv_show' }))
            };
        } catch (error) {
            console.error('❌ Error searching:', error);
            throw error;
        }
    }

    // Get movie by ID
    async getMovieById(id) {
        try {
            const movies = await this.supabaseRequest(`movies?id=eq.${id}&select=*`);
            
            if (movies.length === 0) {
                throw new Error('Movie not found');
            }
            
            return movies[0];
        } catch (error) {
            console.error('❌ Error fetching movie:', error);
            throw error;
        }
    }

    // Get TV show by ID
    async getTVShowById(id) {
        try {
            const tvShows = await this.supabaseRequest(`tv_shows?id=eq.${id}&select=*`);
            
            if (tvShows.length === 0) {
                throw new Error('TV show not found');
            }
            
            return tvShows[0];
        } catch (error) {
            console.error('❌ Error fetching TV show:', error);
            throw error;
        }
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }
}

// Export singleton instance
const dbService = new DatabaseService();
