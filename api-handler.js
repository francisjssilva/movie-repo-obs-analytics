// OMDB API Handler with fallback to local data
const API_KEY = '550196';
const OMDB_BASE_URL = 'https://www.omdbapi.com/';

class MovieAPIHandler {
    constructor() {
        this.cache = new Map();
        this.apiAvailable = true;
        this.cacheExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        this.cacheKey = 'omdb_movie_cache';
        this.loadCacheFromStorage();
    }

    // Load cache from localStorage
    loadCacheFromStorage() {
        try {
            const storedCache = localStorage.getItem(this.cacheKey);
            if (storedCache) {
                const { data, timestamp } = JSON.parse(storedCache);
                const now = Date.now();
                
                // Check if cache is still valid
                if (now - timestamp < this.cacheExpiration) {
                    console.log('📦 Loading cached data from localStorage...');
                    Object.entries(data).forEach(([key, value]) => {
                        this.cache.set(key, value);
                    });
                    console.log(`✅ Loaded ${this.cache.size} items from cache`);
                } else {
                    console.log('⏰ Cache expired, will fetch fresh data');
                    localStorage.removeItem(this.cacheKey);
                }
            }
        } catch (error) {
            console.warn('⚠️ Failed to load cache from storage:', error.message);
        }
    }

    // Save cache to localStorage
    saveCacheToStorage() {
        try {
            const cacheData = {};
            this.cache.forEach((value, key) => {
                cacheData[key] = value;
            });
            
            const cacheObject = {
                data: cacheData,
                timestamp: Date.now()
            };
            
            localStorage.setItem(this.cacheKey, JSON.stringify(cacheObject));
            console.log(`💾 Saved ${this.cache.size} items to localStorage cache`);
        } catch (error) {
            console.warn('⚠️ Failed to save cache to storage:', error.message);
        }
    }

    // Fetch movie data from OMDB API by title
    async fetchFromOMDB(title, year) {
        try {
            const params = new URLSearchParams({
                apikey: API_KEY,
                t: title,
                type: 'movie',
                plot: 'short'
            });

            if (year) {
                params.append('y', year);
            }

            const url = `${OMDB_BASE_URL}?${params}`;
            console.log(`🔍 Fetching from OMDB: ${title} (${year})`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            console.log(`📦 OMDB Response for "${title}":`, data);

            if (data.Response === 'False') {
                console.warn(`❌ OMDB API returned error for "${title}":`, data.Error);
                throw new Error(data.Error || 'Movie not found');
            }

            console.log(`✅ Successfully fetched "${title}" from OMDB`);
            return this.transformOMDBData(data);
        } catch (error) {
            console.warn(`❌ OMDB API failed for "${title}":`, error.message);
            return null;
        }
    }

    // Fetch TV show data from OMDB API
    async fetchTVShowFromOMDB(title, year) {
        try {
            const params = new URLSearchParams({
                apikey: API_KEY,
                t: title,
                type: 'series',
                plot: 'short'
            });

            if (year) {
                const startYear = year.toString().split('-')[0];
                params.append('y', startYear);
            }

            const url = `${OMDB_BASE_URL}?${params}`;
            console.log(`🔍 Fetching TV show from OMDB: ${title} (${year})`);
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            console.log(`📦 OMDB Response for TV "${title}":`, data);

            if (data.Response === 'False') {
                console.warn(`❌ OMDB API returned error for TV "${title}":`, data.Error);
                throw new Error(data.Error || 'TV show not found');
            }

            console.log(`✅ Successfully fetched TV "${title}" from OMDB`);
            return this.transformOMDBData(data);
        } catch (error) {
            console.warn(`❌ OMDB API failed for TV show "${title}":`, error.message);
            return null;
        }
    }

    // Transform OMDB API data to our format
    transformOMDBData(omdbData) {
        return {
            title: omdbData.Title,
            year: omdbData.Year,
            genre: omdbData.Genre,
            imdb: parseFloat(omdbData.imdbRating) || 0,
            description: omdbData.Plot !== 'N/A' ? omdbData.Plot : '',
            poster: omdbData.Poster !== 'N/A' ? omdbData.Poster : '',
            director: omdbData.Director,
            actors: omdbData.Actors,
            runtime: omdbData.Runtime,
            rated: omdbData.Rated,
            awards: omdbData.Awards,
            imdbID: omdbData.imdbID,
            // Generate IMDb video gallery link
            imdbVideoGallery: omdbData.imdbID ? `https://www.imdb.com/title/${omdbData.imdbID}/videogallery/` : null
        };
    }

    // Merge OMDB data with local data
    mergeData(localData, omdbData) {
        if (!omdbData) return localData;

        return {
            ...localData,
            // Keep local data as base
            title: omdbData.title || localData.title,
            year: omdbData.year || localData.year,
            genre: omdbData.genre || localData.genre,
            imdb: omdbData.imdb || localData.imdb,
            description: omdbData.description || localData.description,
            // Prefer OMDB poster if available and valid
            poster: (omdbData.poster && omdbData.poster !== 'N/A') ? omdbData.poster : localData.poster,
            // Keep local YouTube trailer link (primary)
            trailer: localData.trailer,
            // Add IMDb video gallery as backup/alternative
            imdbVideoGallery: omdbData.imdbVideoGallery,
            imdbID: omdbData.imdbID,
            // Add extra OMDB data
            director: omdbData.director,
            actors: omdbData.actors,
            runtime: omdbData.runtime,
            rated: omdbData.rated,
            awards: omdbData.awards
        };
    }

    // Fetch single movie with fallback
    async getMovie(localMovie) {
        const cacheKey = `movie-${localMovie.id}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Try OMDB API if available
        if (this.apiAvailable) {
            const omdbData = await this.fetchFromOMDB(localMovie.title, localMovie.year);
            const mergedData = this.mergeData(localMovie, omdbData);
            this.cache.set(cacheKey, mergedData);
            return mergedData;
        }

        // Fallback to local data
        this.cache.set(cacheKey, localMovie);
        return localMovie;
    }

    // Fetch single TV show with fallback
    async getTVShow(localShow) {
        const cacheKey = `tv-${localShow.id}`;
        
        // Check cache first
        if (this.cache.has(cacheKey)) {
            return this.cache.get(cacheKey);
        }

        // Try OMDB API if available
        if (this.apiAvailable) {
            const omdbData = await this.fetchTVShowFromOMDB(localShow.title, localShow.year);
            const mergedData = this.mergeData(localShow, omdbData);
            this.cache.set(cacheKey, mergedData);
            return mergedData;
        }

        // Fallback to local data
        this.cache.set(cacheKey, localShow);
        return localShow;
    }

    // Fetch all movies with progress tracking
    async getAllMovies(localMovies, onProgress) {
        // Check if all movies are already cached
        const allCached = localMovies.every(movie => this.cache.has(`movie-${movie.id}`));
        
        if (allCached) {
            console.log('⚡ All movies found in cache, loading instantly...');
            const enrichedMovies = localMovies.map(movie => this.cache.get(`movie-${movie.id}`));
            console.log(`✅ Loaded ${enrichedMovies.length} movies from cache`);
            return enrichedMovies;
        }
        
        const enrichedMovies = [];
        console.log(`📊 Starting to fetch ${localMovies.length} movies from OMDB...`);
        
        for (let i = 0; i < localMovies.length; i++) {
            try {
                const wasCached = this.cache.has(`movie-${localMovies[i].id}`);
                const movie = await this.getMovie(localMovies[i]);
                enrichedMovies.push(movie);
                
                if (onProgress) {
                    onProgress(i + 1, localMovies.length, 'movies');
                }
                
                // Only delay if we made an API request (not cached)
                if (!wasCached) {
                    await this.delay(200);
                }
            } catch (error) {
                console.error(`❌ Error fetching movie ${localMovies[i].title}:`, error);
                // Use local data as fallback
                enrichedMovies.push(localMovies[i]);
            }
        }
        
        console.log(`✅ Finished fetching ${enrichedMovies.length} movies`);
        
        // Save cache to localStorage
        this.saveCacheToStorage();
        
        return enrichedMovies;
    }

    // Fetch all TV shows with progress tracking
    async getAllTVShows(localShows, onProgress) {
        // Check if all TV shows are already cached
        const allCached = localShows.every(show => this.cache.has(`tv-${show.id}`));
        
        if (allCached) {
            console.log('⚡ All TV shows found in cache, loading instantly...');
            const enrichedShows = localShows.map(show => this.cache.get(`tv-${show.id}`));
            console.log(`✅ Loaded ${enrichedShows.length} TV shows from cache`);
            return enrichedShows;
        }
        
        const enrichedShows = [];
        console.log(`📊 Starting to fetch ${localShows.length} TV shows from OMDB...`);
        
        for (let i = 0; i < localShows.length; i++) {
            try {
                const wasCached = this.cache.has(`tv-${localShows[i].id}`);
                const show = await this.getTVShow(localShows[i]);
                enrichedShows.push(show);
                
                if (onProgress) {
                    onProgress(i + 1, localShows.length, 'tvShows');
                }
                
                // Only delay if we made an API request (not cached)
                if (!wasCached) {
                    await this.delay(200);
                }
            } catch (error) {
                console.error(`❌ Error fetching TV show ${localShows[i].title}:`, error);
                // Use local data as fallback
                enrichedShows.push(localShows[i]);
            }
        }
        
        console.log(`✅ Finished fetching ${enrichedShows.length} TV shows`);
        
        // Save cache to localStorage
        this.saveCacheToStorage();
        
        return enrichedShows;
    }

    // Test API availability
    async testAPIAvailability() {
        try {
            console.log('🧪 Testing OMDB API availability...');
            const response = await fetch(`${OMDB_BASE_URL}?apikey=${API_KEY}&t=Inception&y=2010`);
            const data = await response.json();
            
            this.apiAvailable = response.ok && data.Response !== 'False';
            
            if (this.apiAvailable) {
                console.log('✅ OMDB API is available and working');
            } else {
                console.warn('⚠️ OMDB API test failed:', data.Error || 'Unknown error');
            }
            
            return this.apiAvailable;
        } catch (error) {
            console.error('❌ OMDB API is not available:', error.message);
            this.apiAvailable = false;
            return false;
        }
    }

    // Helper delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export singleton instance
const movieAPI = new MovieAPIHandler();
