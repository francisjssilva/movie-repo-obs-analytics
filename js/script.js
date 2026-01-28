// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize watched movies from localStorage
    let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    let watchedTVShows = JSON.parse(localStorage.getItem('watchedTVShows')) || [];
    let userFavorites = [];

    // Store all data for filtering/sorting
    let allMovies = [];
    let allTVShows = [];

    // Auth UI elements
    const authBtn = document.getElementById('auth-btn');
    const userMenu = document.getElementById('user-menu');
    const userEmail = document.getElementById('user-email');
    const logoutBtn = document.getElementById('logout-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuthModal = document.getElementById('close-auth-modal');
    const authForm = document.getElementById('auth-form');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authSubmitBtn = document.getElementById('auth-submit-btn');
    const authError = document.getElementById('auth-error');
    const authToggleLink = document.getElementById('auth-toggle-link');
    const authToggleText = document.getElementById('auth-toggle-text');
    const authModalTitle = document.getElementById('auth-modal-title');
    
    let isSignUpMode = false;

    // Auth button click
    authBtn.addEventListener('click', () => {
        authModal.style.display = 'flex';
        isSignUpMode = false;
        updateAuthModal();
    });

    // Close modal
    closeAuthModal.addEventListener('click', () => {
        authModal.style.display = 'none';
        authError.style.display = 'none';
    });

    // Click outside modal
    authModal.addEventListener('click', (e) => {
        if (e.target === authModal) {
            authModal.style.display = 'none';
            authError.style.display = 'none';
        }
    });

    // Toggle between login/signup
    authToggleLink.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUpMode = !isSignUpMode;
        updateAuthModal();
    });

    // Update auth modal text
    function updateAuthModal() {
        if (isSignUpMode) {
            authModalTitle.textContent = 'Sign Up for CineHub';
            authSubmitBtn.textContent = 'Sign Up';
            authToggleText.textContent = 'Already have an account?';
            authToggleLink.textContent = 'Login';
        } else {
            authModalTitle.textContent = 'Login to CineHub';
            authSubmitBtn.textContent = 'Login';
            authToggleText.textContent = "Don't have an account?";
            authToggleLink.textContent = 'Sign up';
        }
        authError.style.display = 'none';
    }

    // Handle auth form submission
    authSubmitBtn.addEventListener('click', async () => {
        const email = authEmail.value.trim();
        const password = authPassword.value;

        if (!email || !password) {
            showAuthError('Please enter email and password');
            return;
        }

        authSubmitBtn.disabled = true;
        authSubmitBtn.textContent = isSignUpMode ? 'Signing up...' : 'Logging in...';

        let result;
        if (isSignUpMode) {
            result = await authService.signUp(email, password);
            if (result.success) {
                showAuthError('Check your email to confirm your account!', false);
                setTimeout(() => {
                    authModal.style.display = 'none';
                    authEmail.value = '';
                    authPassword.value = '';
                }, 2000);
            }
        } else {
            result = await authService.signIn(email, password);
            if (result.success) {
                authModal.style.display = 'none';
                authEmail.value = '';
                authPassword.value = '';
            }
        }

        if (!result.success) {
            showAuthError(result.error);
        }

        authSubmitBtn.disabled = false;
        authSubmitBtn.textContent = isSignUpMode ? 'Sign Up' : 'Login';
    });

    // Show auth error
    function showAuthError(message, isError = true) {
        authError.textContent = message;
        authError.style.display = 'block';
        authError.style.color = isError ? '#ff6b6b' : '#5cd85a';
    }

    // Logout
    logoutBtn.addEventListener('click', async () => {
        await authService.signOut();
    });

    // Listen for auth state changes
    authService.onAuthChange((user) => {
        if (user) {
            authBtn.style.display = 'none';
            userMenu.style.display = 'flex';
            userEmail.textContent = user.email;
            loadUserData();
        } else {
            authBtn.style.display = 'block';
            userMenu.style.display = 'none';
            userFavorites = [];
            // Keep localStorage watched items when logged out
            watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
            watchedTVShows = JSON.parse(localStorage.getItem('watchedTVShows')) || [];
        }
    });

    // Load user favorites
    async function loadUserFavorites() {
        const result = await authService.getFavorites();
        if (result.success) {
            userFavorites = result.data.map(fav => fav.movie_id);
        }
    }

    // Load user watched items
    async function loadUserWatched() {
        const result = await authService.getWatched();
        if (result.success) {
            // Separate watched items by type
            watchedMovies = result.data
                .filter(item => item.item_type === 'movie')
                .map(item => item.item_id);
            watchedTVShows = result.data
                .filter(item => item.item_type === 'tv')
                .map(item => item.item_id);
            
            console.log(`📺 Loaded ${watchedMovies.length} watched movies, ${watchedTVShows.length} watched TV shows`);
        }
        
        // Refresh display
        if (document.getElementById('movies').classList.contains('active')) {
            displayMovies(allMovies);
        } else {
            displayTVShows(allTVShows);
        }
    }

    // Load user data (favorites and watched)
    async function loadUserData() {
        await loadUserFavorites();
        await loadUserWatched();
    }

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
            moviesGrid.innerHTML = '<div class="loading-message">Loading movies catalog...</div>';
            tvShowsGrid.innerHTML = '<div class="loading-message">Loading TV shows...</div>';

            console.log('🗄️ Loading catalog from database...');
            
            // Fetch catalog from database
            const moviesCatalog = await dbService.getMovies();
            const tvShowsCatalog = await dbService.getTVShows();
            
            console.log(`📋 Got ${moviesCatalog.length} movies and ${tvShowsCatalog.length} TV shows from catalog`);
            
            // Enrich movies with OMDB API data (search by title + year)
            console.log('🌐 Enriching movies from OMDB API...');
            moviesGrid.innerHTML = '<div class="loading-message">Enriching movies from OMDB API (0/' + moviesCatalog.length + ')...</div>';
            
            const enrichedMovies = await apiHandler.enrichMoviesFromCatalog(moviesCatalog, (current, total) => {
                moviesGrid.innerHTML = `<div class="loading-message">Enriching movies from OMDB API (${current}/${total})...</div>`;
            });
            
            // Display movies immediately
            allMovies = enrichedMovies;
            displayMovies(enrichedMovies);
            
            // Initialize filters now that movies are ready
            initializeFilters();
            
            // Enrich TV shows with OMDB API data (search by title + year)
            console.log('🌐 Enriching TV shows from OMDB API...');
            tvShowsGrid.innerHTML = '<div class="loading-message">Enriching TV shows from OMDB API (0/' + tvShowsCatalog.length + ')...</div>';
            
            const enrichedTVShows = await apiHandler.enrichMoviesFromCatalog(tvShowsCatalog, (current, total) => {
                tvShowsGrid.innerHTML = `<div class="loading-message">Enriching TV shows from OMDB API (${current}/${total})...</div>`;
            });
            
            console.log(`📺 Enriched ${enrichedTVShows.length} TV shows`);
            
            // Display TV shows
            allTVShows = enrichedTVShows;
            displayTVShows(enrichedTVShows);
            
            // Update filters with TV show data
            updateGenreFilter();
            updateDirectorFilter();
            updateActorFilter();
            
            console.log('✅ Data loaded successfully from OMDB API');
            showNotification('✅ Loaded from OMDB API');
            
        } catch (error) {
            console.error('❌ Error loading data:', error);
            
            const moviesGrid = document.getElementById('movies-grid');
            const tvShowsGrid = document.getElementById('tv-shows-grid');
            
            // If database not configured, show helpful setup message
            if (error.message && error.message.includes('not configured')) {
                const setupMessage = `
                    <div style="padding: 40px; text-align: center; max-width: 600px; margin: 0 auto;">
                        <h2 style="color: #48dbfb; margin-bottom: 20px;">⚙️ Database Setup Optional</h2>
                        <p style="color: rgba(255,255,255,0.8); margin-bottom: 20px; line-height: 1.6;">
                            The database is used as a catalog of movies to fetch. Configure it to enable the full experience.
                        </p>
                        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; text-align: left;">
                            <h3 style="color: #feca57; margin-bottom: 15px;">Quick Setup:</h3>
                            <ol style="color: rgba(255,255,255,0.9); line-height: 1.8;">
                                <li>Create free account at <a href="https://supabase.com" target="_blank" style="color: #48dbfb;">supabase.com</a></li>
                                <li>Run <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">database/schema.sql</code> and <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">seed.sql</code> in SQL Editor</li>
                                <li>Get your Project URL and anon key from Settings → API</li>
                                <li>Update <code style="background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 4px;">db-service.js</code> lines 8-9 with your credentials</li>
                            </ol>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="GITHUB_PAGES_SETUP.md" target="_blank" style="color: #ff6b6b; text-decoration: none; font-weight: 600;">
                                📖 View Full Setup Guide
                            </a>
                        </p>
                    </div>
                `;
                moviesGrid.innerHTML = setupMessage;
                tvShowsGrid.innerHTML = '';
            } else {
                // Generic error
                const errorMessage = `
                    <div style="padding: 40px; text-align: center;">
                        <h2 style="color: #ff6b6b;">❌ Error Loading Data</h2>
                        <p style="color: rgba(255,255,255,0.7); margin-top: 15px;">${error.message}</p>
                        <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #48dbfb; border: none; border-radius: 5px; color: #0f0f23; cursor: pointer; font-weight: 600;">
                            Retry
                        </button>
                    </div>
                `;
                moviesGrid.innerHTML = errorMessage;
                tvShowsGrid.innerHTML = '';
            }
        }
    }

    // Display movies in the grid
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
        
        const isFavorite = userFavorites.includes(item.id);
        
        card.innerHTML = `
            ${authService.isAuthenticated() ? `<button class="favorite-btn ${isFavorite ? 'active' : ''}" data-id="${item.id}" data-type="${type}">❤</button>` : ''}
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
        
        // Add favorite button event listener
        const favoriteBtn = card.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.addEventListener('click', async function(e) {
                e.stopPropagation();
                await toggleFavorite(item, this);
            });
        }
        
        // Add watch button event listener
        const watchBtn = card.querySelector('.watch-btn');
        watchBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleWatched(item.id, type, this);
        });
        
        // Add card click to open trailer modal
        card.addEventListener('click', function(e) {
            // Don't open modal if clicking buttons
            if (!e.target.closest('.watch-btn') && !e.target.closest('.favorite-btn')) {
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
    // Toggle favorite
    async function toggleFavorite(item, button) {
        if (!authService.isAuthenticated()) {
            showNotification('Please login to add favorites');
            authModal.style.display = 'flex';
            return;
        }

        const isFavorite = userFavorites.includes(item.id);
        
        if (isFavorite) {
            const result = await authService.removeFromFavorites(item.id);
            if (result.success) {
                userFavorites = userFavorites.filter(id => id !== item.id);
                button.classList.remove('active');
                showNotification('Removed from favorites');
            }
        } else {
            const result = await authService.addToFavorites(item.id, item);
            if (result.success) {
                userFavorites.push(item.id);
                button.classList.add('active');
                showNotification('Added to favorites! ❤️');
            }
        }
    }

    async function toggleWatched(id, type, button) {
        const isWatched = type === 'movie' ? watchedMovies.includes(id) : watchedTVShows.includes(id);
        const itemData = type === 'movie' 
            ? allMovies.find(m => m.id === id)
            : allTVShows.find(s => s.id === id);
        
        if (type === 'movie') {
            const index = watchedMovies.indexOf(id);
            if (index > -1) {
                watchedMovies.splice(index, 1);
                button.classList.remove('watched');
                button.querySelector('.btn-icon').textContent = '👁';
                button.querySelector('.btn-text').textContent = 'Mark as Watched';
                showNotification('Removed from watched list');
                
                // Sync to database if logged in
                if (authService.isAuthenticated()) {
                    await authService.removeFromWatched(id, 'movie');
                }
            } else {
                watchedMovies.push(id);
                button.classList.add('watched');
                button.querySelector('.btn-icon').textContent = '✓';
                button.querySelector('.btn-text').textContent = 'Watched';
                showNotification('Added to watched list! 🎉');
                
                // Sync to database if logged in
                if (authService.isAuthenticated()) {
                    await authService.addToWatched(id, 'movie', itemData);
                }
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
                
                // Sync to database if logged in
                if (authService.isAuthenticated()) {
                    await authService.removeFromWatched(id, 'tv');
                }
            } else {
                watchedTVShows.push(id);
                button.classList.add('watched');
                button.querySelector('.btn-icon').textContent = '✓';
                button.querySelector('.btn-text').textContent = 'Watched';
                showNotification('Added to watched list! 🎉');
                
                // Sync to database if logged in
                if (authService.isAuthenticated()) {
                    await authService.addToWatched(id, 'tv', itemData);
                }
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
        const sidebarBackdrop = document.getElementById('sidebar-backdrop');
        
        if (sidebarToggleOpen && sidebarToggleClose && sidebar && sidebarBackdrop) {
            // Open sidebar
            sidebarToggleOpen.addEventListener('click', () => {
                sidebar.classList.add('active');
                sidebarBackdrop.classList.add('active');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            });
            
            // Close sidebar
            const closeSidebar = () => {
                sidebar.classList.remove('active');
                sidebarBackdrop.classList.remove('active');
                document.body.style.overflow = ''; // Restore scroll
            };
            
            sidebarToggleClose.addEventListener('click', closeSidebar);
            sidebarBackdrop.addEventListener('click', closeSidebar);
            
            // Close sidebar when clicking outside
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024 && 
                    sidebar.classList.contains('active') && 
                    !sidebar.contains(e.target) && 
                    !sidebarToggleOpen.contains(e.target)) {
                    closeSidebar();
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
