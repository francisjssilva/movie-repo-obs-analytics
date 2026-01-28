// Tab switching functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Initialize watched movies from localStorage
    let watchedMovies = JSON.parse(localStorage.getItem('watchedMovies')) || [];
    let watchedTVShows = JSON.parse(localStorage.getItem('watchedTVShows')) || [];

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
            displayMovies(enrichedMovies);
            displayTVShows(enrichedTVShows);

            console.log('✅ Data loaded successfully with OMDB API enrichment');
        } catch (error) {
            console.error('Error loading movie data:', error);
            // Fallback to local data only
            displayMovies(moviesData.movies);
            displayTVShows(moviesData.tvShows);
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
            
            allCards.forEach(card => {
                const title = card.querySelector('.card-title').textContent.toLowerCase();
                const description = card.querySelector('.card-description').textContent.toLowerCase();
                const genre = card.querySelector('.genre').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm) || genre.includes(searchTerm)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                    foundCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show notification
            if (foundCount === 0) {
                showNotification(`No results found for "${searchTerm}"`);
            } else {
                showNotification(`Found ${foundCount} result(s) for "${searchTerm}"`);
            }
        } else {
            // Show all cards if search is empty
            const allCards = document.querySelectorAll('.card');
            allCards.forEach(card => {
                card.style.display = 'block';
            });
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
