// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize watched movies from localStorage
    let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    let watchedTVShows = JSON.parse(localStorage.getItem('watchedTVShows')) || [];

    // Store all data for filtering/sorting
    let allMovies = [];
    let allTVShows = [];

    // Load movie data
    loadMovieData();

    // Tab switching
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            document.getElementById(tabId).classList.add('active');
            
            // Update filters for active tab
            updateGenreFilter();
            updateDirectorFilter();
            updateActorFilter();
        });
    });

    // Load movie data
    async function loadMovieData() {
        try {
            // Show loading indicator
            const moviesGrid = document.getElementById('movies-grid');
            const tvShowsGrid = document.getElementById('tv-shows-grid');
            moviesGrid.innerHTML = '<div class="loading-message">Loading movies from OMDB API...</div>';
            tvShowsGrid.innerHTML = '<div class="loading-message">Loading TV shows from OMDB API...</div>';

            // Test API availability first
            await movieAPI.testAPIAvailability();

            // Fetch enriched movie data
            const enrichedMovies = await movieAPI.getAllMovies(moviesData.movies, (current, total, type) => {
                moviesGrid.innerHTML = `<div class="loading-message">Loading movies... ${current}/${total}</div>`;
            });

            // Fetch enriched TV show data
            const enrichedTVShows = await movieAPI.getAllTVShows(moviesData.tvShows, (current, total, type) => {
                tvShowsGrid.innerHTML = `<div class="loading-message">Loading TV shows... ${current}/${total}</div>`;
            });

            // Display enriched data
            allMovies = enrichedMovies;
            allTVShows = enrichedTVShows;
            displayMovies(enrichedMovies);
            displayTVShows(enrichedTVShows);
            
            // Initialize filters
            initializeFilters();

            console.log('✅ Data loaded successfully with OMDB API enrichment');
        } catch (error) {
            console.error('Error loading movie data:', error);
            // Fallback to local data only
            allMovies = moviesData.movies;
            allTVShows = moviesData.tvShows;
            displayMovies(moviesData.movies);
            displayTVShows(moviesData.tvShows);
            
            // Initialize filters
            initializeFilters();
            
            showNotification('⚠️ Using local data only (API unavailable)');
            console.warn('⚠️ Using local data only (API unavailable)');
        }
    }

    // Display movies
    function displayMovies(movies) {
        const moviesGrid = document.getElementById('movies-grid');
        moviesGrid.innerHTML = '';
        
        movies.forEach(movie => {
            const isWatched = watchedMovies.includes(movie.id);
            const card = createCard(movie, isWatched, 'movie');
            moviesGrid.appendChild(card);
        });
    }

    // Display TV shows
    function displayTVShows(tvShows) {
        const tvShowsGrid = document.getElementById('tv-shows-grid');
        tvShowsGrid.innerHTML = '';
        
        tvShows.forEach(show => {
            const isWatched = watchedTVShows.includes(show.id);
            const card = createCard(show, isWatched, 'tvshow');
            tvShowsGrid.appendChild(card);
        });
    }

    // Create a card element
    function createCard(item, isWatched, type) {
        const card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('data-id', item.id);
        card.setAttribute('data-type', type);
        
        card.innerHTML = `
            <div class="card-poster">
                ${item.poster ? `<img src="${item.poster}" alt="${item.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">` : ''}
                <div class="poster-placeholder" style="${item.poster ? 'display:none;' : ''}">🎬</div>
            </div>
            <div class="card-info">
                <h3 class="card-title">${item.title}</h3>
                <div class="card-meta">
                    <span class="year">${item.year}</span>
                    <span class="imdb-badge">IMDb ${item.imdb}</span>
                </div>
                <div class="genre">${item.genre}</div>
                <p class="card-description">${item.description}</p>
                <button class="watch-btn ${isWatched ? 'watched' : ''}" data-id="${item.id}" data-type="${type}">
                    <span class="btn-icon">${isWatched ? '✓' : '👁'}</span>
                    <span class="btn-text">${isWatched ? 'Watched' : 'Mark as Watched'}</span>
                </button>
            </div>
        `;
        
        // Add watch button event listener
        const watchBtn = card.querySelector('.watch-btn');
        watchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWatched(item.id, type, this);
        });
        
        // Add card click to open trailer modal
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking the watch button
            if (!e.target.closest('.watch-btn')) {
                openTrailerModal(item);
            }
        });
        
        // Add card hover animation
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
        
        return card;
    }

    // Toggle watched status
    function toggleWatched(id, type, button) {
        if (type === 'movie') {
            const index = watchedMovies.indexOf(id);
            if (index > -1) {
                watchedMovies.splice(index, 1);
                button.classList.remove('watched');
                button.querySelector('.btn-icon').textContent = '👁';
                button.querySelector('.btn-text').textContent = 'Mark as Watched';
                showNotification('Removed from watched list');
            } else {
                watchedMovies.push(id);
                button.classList.add('watched');
                button.querySelector('.btn-icon').textContent = '✓';
                button.querySelector('.btn-text').textContent = 'Watched';
                showNotification('Added to watched list! 🎉');
            }
            localStorage.setItem('watchedMovies', JSON.stringify(watchedMovies));
        } else {
            const index = watchedTVShows.indexOf(id);
            if (index > -1) {
                watchedTVShows.splice(index, 1);
                button.classList.remove('watched');
                button.querySelector('.btn-icon').textContent = '👁';
                button.querySelector('.btn-text').textContent = 'Mark as Watched';
                showNotification('Removed from watched list');
            } else {
                watchedTVShows.push(id);
                button.classList.add('watched');
                button.querySelector('.btn-icon').textContent = '✓';
                button.querySelector('.btn-text').textContent = 'Watched';
                showNotification('Added to watched list! 🎉');
            }
            localStorage.setItem('watchedTVShows', JSON.stringify(watchedTVShows));
        }
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm) {
            const allCards = document.querySelectorAll('.card');
            let foundCount = 0;
            let foundInMovies = 0;
            let foundInTVShows = 0;
            
            allCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                const genre = card.querySelector('.genre').textContent.toLowerCase();
                const type = card.getAttribute('data-type');
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || genre.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                    foundCount++;
                    
                    // Track which tab has results
                    if (type === 'movie') {
                        foundInMovies++;
                    } else if (type === 'tvshow') {
                        foundInTVShows++;
                    }
                } else {
                    card.style.display = 'none';
                }
            });

            // Auto-switch to the tab with results
            if (foundCount > 0) {
                if (foundInMovies > 0 && foundInTVShows === 0) {
                    // Only movies found, switch to movies tab
                    switchToTab('movies');
                } else if (foundInTVShows > 0 && foundInMovies === 0) {
                    // Only TV shows found, switch to TV shows tab
                    switchToTab('tv-shows');
                }
                // If both have results, stay on current tab
            }

            // Show notification
            if (foundCount === 0) {
                showNotification(`No results found for "${searchTerm}"`);
            } else {
                let message = `Found ${foundCount} result(s) for "${searchTerm}"`;
                if (foundInMovies > 0 && foundInTVShows > 0) {
                    message += ` (${foundInMovies} movies, ${foundInTVShows} TV shows)`;
                }
                showNotification(message);
            }
        } else {
            // Show all cards if search is empty
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    }

    // Helper function to switch tabs
    function switchToTab(tabId) {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        // Remove active class from all
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to target
        const targetBtn = document.querySelector(`[data-tab="${tabId}"]`);
        const targetContent = document.getElementById(tabId);
        
        if (targetBtn && targetContent) {
            targetBtn.classList.add('active');
            targetContent.classList.add('active');
        }
    }

    searchBtn.addEventListener('click', performSearch);
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });

    // Clear search when input is cleared
    searchInput.addEventListener('input', function() {
        if (this.value === '') {
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.style.display = 'block';
            });
        }
    });

    // Show notification function
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            background: linear-gradient(45deg, #ff6b6b, #feca57);
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 1000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // Movie Info Modal Functions
    function openTrailerModal(item) {
        const modal = document.getElementById('trailer-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalMeta = document.getElementById('modal-meta');
        const imdbBtn = document.getElementById('imdb-trailer-btn');
        const youtubeBtn = document.getElementById('youtube-trailer-btn');

        // Set modal content
        modalTitle.textContent = item.title;
        modalMeta.innerHTML = `
            <span>${item.year}</span> • 
            <span>${item.genre}</span> • 
            <span>IMDb ${item.imdb}</span>
        `;

        // Set movie details
        document.getElementById('modal-director').textContent = item.director || 'N/A';
        document.getElementById('modal-actors').textContent = item.actors || 'N/A';
        document.getElementById('modal-runtime').textContent = item.runtime || 'N/A';
        document.getElementById('modal-rated').textContent = item.rated || 'N/A';
        document.getElementById('modal-description').textContent = item.description || 'N/A';

        // Configure trailer buttons
        if (item.imdbVideoGallery) {
            imdbBtn.href = item.imdbVideoGallery;
            imdbBtn.style.display = 'inline-flex';
        } else {
            imdbBtn.style.display = 'none';
        }

        if (item.trailer) {
            // Convert embed URL to watch URL for external opening
            const videoId = item.trailer.includes('embed/') 
                ? item.trailer.split('embed/')[1].split('?')[0]
                : '';
            youtubeBtn.href = videoId ? `https://www.youtube.com/watch?v=${videoId}` : item.trailer;
            youtubeBtn.style.display = 'inline-flex';
        } else {
            youtubeBtn.style.display = 'none';
        }

        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeTrailerModal() {
        const modal = document.getElementById('trailer-modal');

        // Hide modal
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    // Modal event listeners
    const modal = document.getElementById('trailer-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    modalClose.addEventListener('click', closeTrailerModal);
    modalOverlay.addEventListener('click', closeTrailerModal);

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTrailerModal();
        }
    });

    // Filter and Sort Functionality
    function initializeFilters() {
        updateGenreFilter();
        updateDirectorFilter();
        updateActorFilter();
        
        const genreSelectBtn = document.getElementById('genre-select-btn');
        const genreDropdown = document.getElementById('genre-dropdown');
        const actorSelectBtn = document.getElementById('actor-select-btn');
        const actorDropdown = document.getElementById('actor-dropdown');
        const ratingFilter = document.getElementById('rating-filter');
        const watchedFilter = document.getElementById('watched-filter');
        const runtimeFilter = document.getElementById('runtime-filter');
        const runtimeValue = document.getElementById('runtime-value');
        const directorFilter = document.getElementById('director-filter');
        const sortBy = document.getElementById('sort-by');
        const resetBtn = document.querySelector('.reset-btn-sidebar');
        
        // Sidebar toggle functionality
        const sidebarToggleOpen = document.getElementById('sidebar-toggle-open');
        const sidebarToggleClose = document.getElementById('sidebar-toggle-close');
        const sidebar = document.getElementById('filters-sidebar');
        
        if (sidebarToggleOpen && sidebarToggleClose && sidebar) {
            sidebarToggleOpen.addEventListener('click', () => {
                sidebar.classList.add('active');
            });
            
            sidebarToggleClose.addEventListener('click', () => {
                sidebar.classList.remove('active');
            });
            
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024 && 
                    sidebar.classList.contains('active') && 
                    !sidebar.contains(e.target) && 
                    !sidebarToggleOpen.contains(e.target)) {
                    sidebar.classList.remove('active');
                }
            });
        }
        
        // Genre dropdown toggle
        genreSelectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            genreSelectBtn.classList.toggle('active');
            genreDropdown.classList.toggle('active');
            // Close actor dropdown
            actorSelectBtn.classList.remove('active');
            actorDropdown.classList.remove('active');
        });
        
        // Actor dropdown toggle
        actorSelectBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            actorSelectBtn.classList.toggle('active');
            actorDropdown.classList.toggle('active');
            // Close genre dropdown
            genreSelectBtn.classList.remove('active');
            genreDropdown.classList.remove('active');
        });
        
        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.multi-select')) {
                genreSelectBtn.classList.remove('active');
                genreDropdown.classList.remove('active');
                actorSelectBtn.classList.remove('active');
                actorDropdown.classList.remove('active');
            }
        });
        
        // Runtime slider
        runtimeFilter.addEventListener('input', (e) => {
            const value = e.target.value;
            runtimeValue.textContent = value == 0 ? 'Any' : `${value}+ min`;
            applyFiltersAndSort();
        });
        
        // Rating slider
        ratingFilter.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            const ratingValue = document.getElementById('rating-value');
            ratingValue.textContent = value == 0 ? 'Any' : `${value.toFixed(1)}+`;
            applyFiltersAndSort();
        });
        
        // Add event listeners for other filters
        ratingFilter.addEventListener('change', applyFiltersAndSort);
        watchedFilter.addEventListener('change', applyFiltersAndSort);
        directorFilter.addEventListener('change', applyFiltersAndSort);
        sortBy.addEventListener('change', applyFiltersAndSort);
        resetBtn.addEventListener('click', resetFilters);
    }
    
    function updateGenreFilter() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const data = activeTab === 'movies' ? allMovies : allTVShows;
        
        // Extract unique genres
        const genres = new Set();
        data.forEach(item => {
            if (item.genre) {
                item.genre.split(',').forEach(g => genres.add(g.trim()));
            }
        });
        
        // Update genre options with checkboxes
        const genreOptions = document.getElementById('genre-options');
        genreOptions.innerHTML = '';
        
        Array.from(genres).sort().forEach(genre => {
            const option = document.createElement('div');
            option.className = 'genre-option';
            option.innerHTML = `
                <input type="checkbox" id="genre-${genre.replace(/\\s+/g, '-')}" value="${genre}">
                <label for="genre-${genre.replace(/\\s+/g, '-')}">${genre}</label>
            `;
            genreOptions.appendChild(option);
            
            // Add change listener
            const checkbox = option.querySelector('input');
            checkbox.addEventListener('change', () => {
                updateGenreButtonText();
                applyFiltersAndSort();
            });
        });
        
        updateGenreButtonText();
    }
    
    function updateGenreButtonText() {
        const selectedGenres = getSelectedGenres();
        const buttonText = document.getElementById('genre-selected-text');
        
        if (selectedGenres.length === 0) {
            buttonText.textContent = 'All Genres';
        } else if (selectedGenres.length === 1) {
            buttonText.textContent = selectedGenres[0];
        } else {
            buttonText.textContent = `${selectedGenres.length} genres selected`;
        }
    }
    
    function getSelectedGenres() {
        const checkboxes = document.querySelectorAll('#genre-options input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    function updateDirectorFilter() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const data = activeTab === 'movies' ? allMovies : allTVShows;
        
        // Extract unique directors
        const directors = new Set();
        data.forEach(item => {
            if (item.director && item.director !== 'N/A') {
                item.director.split(',').forEach(d => directors.add(d.trim()));
            }
        });
        
        // Update director filter options
        const directorFilter = document.getElementById('director-filter');
        const currentValue = directorFilter.value;
        directorFilter.innerHTML = '<option value="all">All Directors</option>';
        Array.from(directors).sort().forEach(director => {
            const option = document.createElement('option');
            option.value = director;
            option.textContent = director;
            directorFilter.appendChild(option);
        });
        directorFilter.value = currentValue === 'all' ? 'all' : (Array.from(directors).includes(currentValue) ? currentValue : 'all');
    }
    
    function updateActorFilter() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const data = activeTab === 'movies' ? allMovies : allTVShows;
        
        // Extract unique actors
        const actors = new Set();
        data.forEach(item => {
            if (item.actors && item.actors !== 'N/A') {
                item.actors.split(',').forEach(a => actors.add(a.trim()));
            }
        });
        
        // Update actor options with checkboxes
        const actorOptions = document.getElementById('actor-options');
        actorOptions.innerHTML = '';
        
        Array.from(actors).sort().forEach(actor => {
            const option = document.createElement('div');
            option.className = 'actor-option';
            option.innerHTML = `
                <input type="checkbox" id="actor-${actor.replace(/\\s+/g, '-')}" value="${actor}">
                <label for="actor-${actor.replace(/\\s+/g, '-')}">${actor}</label>
            `;
            actorOptions.appendChild(option);
            
            // Add change listener
            const checkbox = option.querySelector('input');
            checkbox.addEventListener('change', () => {
                updateActorButtonText();
                applyFiltersAndSort();
            });
        });
        
        updateActorButtonText();
    }
    
    function updateActorButtonText() {
        const selectedActors = getSelectedActors();
        const buttonText = document.getElementById('actor-selected-text');
        
        if (selectedActors.length === 0) {
            buttonText.textContent = 'All Actors';
        } else if (selectedActors.length === 1) {
            buttonText.textContent = selectedActors[0];
        } else {
            buttonText.textContent = `${selectedActors.length} actors selected`;
        }
    }
    
    function getSelectedActors() {
        const checkboxes = document.querySelectorAll('#actor-options input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.value);
    }
    
    function applyFiltersAndSort() {
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        const selectedGenres = getSelectedGenres();
        const selectedActors = getSelectedActors();
        const ratingFilter = parseFloat(document.getElementById('rating-filter').value);
        const watchedFilter = document.getElementById('watched-filter').value;
        const runtimeFilter = parseInt(document.getElementById('runtime-filter').value);
        const directorFilter = document.getElementById('director-filter').value;
        const sortBy = document.getElementById('sort-by').value;
        
        let data = activeTab === 'movies' ? [...allMovies] : [...allTVShows];
        const watchedList = activeTab === 'movies' ? watchedMovies : watchedTVShows;
        
        // Apply filters
        data = data.filter(item => {
            // Genre filter - match ANY selected genre
            if (selectedGenres.length > 0) {
                const itemGenres = item.genre.split(',').map(g => g.trim());
                const hasMatchingGenre = selectedGenres.some(selected => 
                    itemGenres.includes(selected)
                );
                if (!hasMatchingGenre) {
                    return false;
                }
            }
            
            // Actor filter - match ANY selected actor
            if (selectedActors.length > 0 && item.actors && item.actors !== 'N/A') {
                const itemActors = item.actors.split(',').map(a => a.trim());
                const hasMatchingActor = selectedActors.some(selected => 
                    itemActors.includes(selected)
                );
                if (!hasMatchingActor) {
                    return false;
                }
            }
            
            // Rating filter
            if (item.imdb < ratingFilter) {
                return false;
            }
            
            // Runtime filter
            if (runtimeFilter > 0 && item.runtime) {
                const runtime = parseInt(item.runtime);
                if (isNaN(runtime) || runtime < runtimeFilter) {
                    return false;
                }
            }
            
            // Director filter
            if (directorFilter !== 'all' && item.director) {
                if (!item.director.includes(directorFilter)) {
                    return false;
                }
            }
            
            // Watched filter
            if (watchedFilter === 'watched' && !watchedList.includes(item.id)) {
                return false;
            }
            if (watchedFilter === 'unwatched' && watchedList.includes(item.id)) {
                return false;
            }
            
            return true;
        });
        
        // Apply sorting
        switch(sortBy) {
            case 'title-asc':
                data.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                data.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'rating-desc':
                data.sort((a, b) => b.imdb - a.imdb);
                break;
            case 'rating-asc':
                data.sort((a, b) => a.imdb - b.imdb);
                break;
            case 'year-desc':
                data.sort((a, b) => {
                    const yearA = parseInt(a.year.toString().split('-')[0]);
                    const yearB = parseInt(b.year.toString().split('-')[0]);
                    return yearB - yearA;
                });
                break;
            case 'year-asc':
                data.sort((a, b) => {
                    const yearA = parseInt(a.year.toString().split('-')[0]);
                    const yearB = parseInt(b.year.toString().split('-')[0]);
                    return yearA - yearB;
                });
                break;
        }
        
        // Display filtered and sorted data
        if (activeTab === 'movies') {
            displayMovies(data);
        } else {
            displayTVShows(data);
        }
        
        // Show notification
        const totalCount = activeTab === 'movies' ? allMovies.length : allTVShows.length;
        if (data.length < totalCount) {
            showNotification(`Showing ${data.length} of ${totalCount} ${activeTab === 'movies' ? 'movies' : 'TV shows'}`);
        }
    }
    
    function resetFilters() {
        // Clear genre checkboxes
        const genreCheckboxes = document.querySelectorAll('#genre-options input[type="checkbox"]');
        genreCheckboxes.forEach(cb => cb.checked = false);
        updateGenreButtonText();
        
        // Clear actor checkboxes
        const actorCheckboxes = document.querySelectorAll('#actor-options input[type="checkbox"]');
        actorCheckboxes.forEach(cb => cb.checked = false);
        updateActorButtonText();
        
        document.getElementById('rating-filter').value = '0';
        document.getElementById('rating-value').textContent = 'Any';
        document.getElementById('watched-filter').value = 'all';
        document.getElementById('runtime-filter').value = '0';
        document.getElementById('runtime-value').textContent = 'Any';
        document.getElementById('director-filter').value = 'all';
        document.getElementById('sort-by').value = 'default';
        
        const activeTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        if (activeTab === 'movies') {
            displayMovies(allMovies);
        } else {
            displayTVShows(allTVShows);
        }
        
        showNotification('✅ Filters reset');
    }

    // Add animation styles for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});
