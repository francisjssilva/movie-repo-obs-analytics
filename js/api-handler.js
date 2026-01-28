// API Handler for CineHub
// Handles OMDB API requests with caching and rate limiting

class APIHandler {
    constructor() {
        //550196
        this.apiKey = 'da5c7fa5'; // OMDB API key
        this.baseUrl = 'https://www.omdbapi.com/';
        this.cache = new Map();
        this.cacheExpiration = 5 * 60 * 1000; // 5 minutes cache
        this.requestDelay = 200; // 200ms delay between requests
        this.lastRequestTime = 0;
        
        // Load cache from localStorage
        this.loadCacheFromStorage();
    }
    
    // Load cache from localStorage
    loadCacheFromStorage() {
        try {
            const stored = localStorage.getItem('omdb_cache');
            if (stored) {
                const parsed = JSON.parse(stored);
                const now = Date.now();
                let loadedCount = 0;
                let expiredCount = 0;
                
                // Restore only non-expired entries
                Object.entries(parsed).forEach(([key, value]) => {
                    if (now - value.timestamp < this.cacheExpiration) {
                        this.cache.set(key, value);
                        loadedCount++;
                    } else {
                        expiredCount++;
                    }
                });
                
                console.log(`📦 Loaded ${loadedCount} cached items from storage (${expiredCount} expired)`);
            } else {
                console.log('📦 No cache found in storage');
            }
        } catch (error) {
            console.warn('⚠️ Failed to load cache from storage:', error);
        }
    }
    
    // Save cache to localStorage
    saveCacheToStorage() {
        try {
            const cacheObject = {};
            this.cache.forEach((value, key) => {
                cacheObject[key] = value;
            });
            localStorage.setItem('omdb_cache', JSON.stringify(cacheObject));
        } catch (error) {
            console.warn('⚠️ Failed to save cache to storage:', error);
        }
    }

    // Rate limiting - wait if needed
    async waitForRateLimit() {
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        
        if (timeSinceLastRequest < this.requestDelay) {
            const waitTime = this.requestDelay - timeSinceLastRequest;
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        this.lastRequestTime = Date.now();
    }

    // Search for multiple movies/shows by title (returns list)
    async searchTitles(searchTerm, type = null) {
        await this.waitForRateLimit();

        console.log(`🔍 Searching OMDB for: "${searchTerm}"`);
        
        // Build URL for search (use 's' parameter for multiple results)
        let url = `${this.baseUrl}?apikey=${this.apiKey}&s=${encodeURIComponent(searchTerm)}`;
        if (type) {
            url += `&type=${type}`; // 'movie' or 'series'
        }
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True' && data.Search) {
                console.log(`✅ Found ${data.Search.length} results`);
                return data.Search; // Returns array of {Title, Year, imdbID, Type, Poster}
            } else {
                console.warn(`⚠️ No results found for "${searchTerm}"`);
                return [];
            }
        } catch (error) {
            console.error(`❌ Error searching OMDB:`, error);
            return [];
        }
    }

    // Fetch full movie details by IMDb ID
    async fetchMovieDetailsByID(imdbID) {
        await this.waitForRateLimit();

        console.log(`📥 Fetching full details for ${imdbID}`);
        
        const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${imdbID}&plot=full`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True') {
                console.log(`✅ Got full details for ${data.Title}`);
                return data; // Return raw OMDB data
            } else {
                console.warn(`⚠️ Details not found for ${imdbID}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error fetching details:`, error);
            return null;
        }
    }

    // Search for movie by title and year
    async searchMovie(title, year) {
        // Parse and validate year
        let validYear = null;
        if (year) {
            // Extract first 4-digit year from formats like "2014-2019" or "2014-"
            const yearMatch = String(year).match(/(\d{4})/);
            if (yearMatch && yearMatch[1] >= 1900 && yearMatch[1] <= 2100) {
                validYear = yearMatch[1];
            }
        }
        
        const cacheKey = `${title}_${validYear || 'any'}`;
        
        // Check cache first
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
            console.log(`📦 Cache HIT: ${title} (${validYear || 'any year'})`);
            return cached.data;
        }

        // Rate limiting
        await this.waitForRateLimit();

        console.log(`🌐 Cache MISS - Fetching: ${title} (${validYear || 'any year'})`);
        
        // Build URL with or without year
        let url = `${this.baseUrl}?apikey=${this.apiKey}&t=${encodeURIComponent(title)}&plot=full`;
        if (validYear) {
            url += `&y=${validYear}`;
        }
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True') {
                // Transform OMDB response to our format
                const movieData = {
                    id: data.imdbID,
                    title: data.Title,
                    year: parseInt(data.Year),
                    genre: data.Genre,
                    imdb: parseFloat(data.imdbRating) || 0,
                    description: data.Plot,
                    poster: data.Poster !== 'N/A' ? data.Poster : null,
                    trailer: null, // Will be merged from DB
                    director: data.Director !== 'N/A' ? data.Director : null,
                    actors: data.Actors !== 'N/A' ? data.Actors : null,
                    runtime: data.Runtime !== 'N/A' ? data.Runtime : null,
                    rated: data.Rated !== 'N/A' ? data.Rated : null,
                    imdbID: data.imdbID
                };

                // Cache the result
                this.cache.set(cacheKey, {
                    data: movieData,
                    timestamp: Date.now()
                });

                return movieData;
            } else {
                console.warn(`⚠️ OMDB API: ${title} not found`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error searching OMDB for ${title}:`, error);
            return null;
        }
    }

    // Fetch movie details by IMDb ID
    async fetchMovieDetails(imdbID) {
        // Check cache first
        const cached = this.cache.get(imdbID);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiration) {
            console.log(`📦 Using cached data for ${imdbID}`);
            return cached.data;
        }

        // Rate limiting
        await this.waitForRateLimit();

        console.log(`🌐 Fetching from OMDB API: ${imdbID}`);
        
        const url = `${this.baseUrl}?apikey=${this.apiKey}&i=${imdbID}&plot=full`;
        
        try {
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.Response === 'True') {
                // Transform OMDB response to our format
                const movieData = {
                    id: imdbID,
                    title: data.Title,
                    year: parseInt(data.Year),
                    genre: data.Genre,
                    imdb: parseFloat(data.imdbRating) || 0,
                    description: data.Plot,
                    poster: data.Poster !== 'N/A' ? data.Poster : null,
                    trailer: null,
                    director: data.Director !== 'N/A' ? data.Director : null,
                    actors: data.Actors !== 'N/A' ? data.Actors : null,
                    runtime: data.Runtime !== 'N/A' ? data.Runtime : null,
                    rated: data.Rated !== 'N/A' ? data.Rated : null,
                    imdbID: data.imdbID
                };

                // Cache the result
                this.cache.set(imdbID, {
                    data: movieData,
                    timestamp: Date.now()
                });

                return movieData;
            } else {
                console.warn(`⚠️ OMDB API error for ${imdbID}: ${data.Error}`);
                return null;
            }
        } catch (error) {
            console.error(`❌ Error fetching from OMDB for ${imdbID}:`, error);
            return null;
        }
    }

    // Enrich movies from catalog by searching OMDB
    async enrichMoviesFromCatalog(catalogMovies, onProgress) {
        const results = [];
        
        for (let i = 0; i < catalogMovies.length; i++) {
            const catalogMovie = catalogMovies[i];
            
            // Search OMDB by title and year
            const omdbData = await this.searchMovie(catalogMovie.title, catalogMovie.year);
            
            if (omdbData) {
                // Merge catalog data (especially trailer) with OMDB data
                const enrichedMovie = {
                    ...omdbData,
                    trailer: catalogMovie.trailer || omdbData.trailer // Keep trailer from catalog
                };
                console.log(`✅ Enriched: ${enrichedMovie.title} - Poster: ${enrichedMovie.poster ? 'Yes' : 'No'}`);
                results.push(enrichedMovie);
            } else {
                // If OMDB search fails, use catalog data as fallback
                console.warn(`⚠️ Using catalog data for: ${catalogMovie.title}`);
                results.push(catalogMovie);
            }
            
            // Call progress callback if provided
            if (onProgress) {
                onProgress(i + 1, catalogMovies.length);
            }
        }
        
        console.log(`📊 Total enriched: ${results.length} movies`);
        
        // Save cache to localStorage after batch operation
        this.saveCacheToStorage();
        console.log(`💾 Cache saved: ${this.cache.size} items`);
        
        return results;
    }

    // Fetch multiple movies with progress updates
    async fetchMultipleMovies(imdbIDs, onProgress) {
        const results = [];
        
        for (let i = 0; i < imdbIDs.length; i++) {
            const imdbID = imdbIDs[i];
            const movieData = await this.fetchMovieDetails(imdbID);
            
            if (movieData) {
                results.push(movieData);
            }
            
            // Call progress callback if provided
            if (onProgress) {
                onProgress(i + 1, imdbIDs.length);
            }
        }
        
        return results;
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Get cache stats
    getCacheStats() {
        return {
            size: this.cache.size,
            items: Array.from(this.cache.keys())
        };
    }
}

// Create global instance
const apiHandler = new APIHandler();
