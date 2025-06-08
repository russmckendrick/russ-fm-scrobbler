export const JS_CONTENT = `// RUSS FM SCROBBLER - FRONTEND JAVASCRIPT

class ScrobblerApp {
    constructor() {
        this.currentUser = null;
        this.searchResults = [];
        this.selectedAlbum = null;
        this.currentPage = 1;
        this.totalPages = 1;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuthStatus();
        this.updateSearchInputs();
        
        // Handle direct album URLs after everything is initialized
        this.handleDirectAlbumURL();
    }

    bindEvents() {
        // Authentication
        document.getElementById('login-btn').addEventListener('click', () => this.login());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Search type toggle
        document.querySelectorAll('input[name="search-type"]').forEach(radio => {
            radio.addEventListener('change', () => this.updateSearchInputs());
        });

        // Search
        document.getElementById('search-btn').addEventListener('click', () => this.performSearch());
        
        // Enter key support for search inputs
        document.getElementById('release-id').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        document.getElementById('artist-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });
        document.getElementById('album-name').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.performSearch();
        });

        // Album actions
        document.getElementById('scrobble-all-btn').addEventListener('click', () => this.scrobbleAlbum());
        document.getElementById('clear-selection-btn').addEventListener('click', () => this.clearSelection());
    }

    async checkAuthStatus() {
        try {
            const response = await fetch('/api/auth/status');
            const data = await response.json();
            
            if (data.authenticated) {
                this.currentUser = data.user;
                this.updateUserStatus(true);
            } else {
                this.updateUserStatus(false);
            }
        } catch (error) {
            console.error('Auth status check failed:', error);
            this.updateUserStatus(false);
        }
    }

    updateUserStatus(authenticated) {
        const userInfo = document.getElementById('user-info');
        const loginBtn = document.getElementById('login-btn');
        const logoutBtn = document.getElementById('logout-btn');

        if (authenticated && this.currentUser) {
            userInfo.textContent = \`Logged in as \${this.currentUser.username}\`;
            loginBtn.classList.add('d-none');
            logoutBtn.classList.remove('d-none');
        } else {
            userInfo.textContent = 'Not logged in';
            loginBtn.classList.remove('d-none');
            logoutBtn.classList.add('d-none');
        }
    }

    async login() {
        try {
            const response = await fetch('/api/auth/login', { method: 'POST' });
            const data = await response.json();
            
            if (data.authUrl) {
                window.location.href = data.authUrl;
            } else {
                this.showStatus('error', 'Failed to initiate login');
            }
        } catch (error) {
            console.error('Login failed:', error);
            this.showStatus('error', 'Login failed');
        }
    }

    async logout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            this.currentUser = null;
            this.updateUserStatus(false);
            this.showStatus('success', 'Logged out successfully');
        } catch (error) {
            console.error('Logout failed:', error);
            this.showStatus('error', 'Logout failed');
        }
    }

    updateSearchInputs() {
        const searchType = document.querySelector('input[name="search-type"]:checked').value;
        const releaseIdInput = document.getElementById('release-id-input');
        const artistAlbumInput = document.getElementById('artist-album-input');

        if (searchType === 'release-id') {
            releaseIdInput.classList.remove('d-none');
            artistAlbumInput.classList.add('d-none');
        } else {
            releaseIdInput.classList.add('d-none');
            artistAlbumInput.classList.remove('d-none');
        }
    }

    async performSearch(page = 1) {
        const searchType = document.querySelector('input[name="search-type"]:checked').value;
        const searchBtn = document.getElementById('search-btn');
        
        let searchParams = {};

        if (searchType === 'release-id') {
            const releaseId = document.getElementById('release-id').value.trim();
            if (!releaseId) {
                this.showStatus('error', 'Please enter a release ID');
                return;
            }
            searchParams.releaseId = releaseId;
        } else {
            const artist = document.getElementById('artist-name').value.trim();
            const album = document.getElementById('album-name').value.trim();
            
            if (!artist || !album) {
                this.showStatus('error', 'Please enter both artist and album name');
                return;
            }
            searchParams.artist = artist;
            searchParams.album = album;
        }

        searchParams.page = page;

        try {
            searchBtn.disabled = true;
            searchBtn.classList.add('loading');
            this.showStatus('loading', 'Searching...');

            const queryString = new URLSearchParams(searchParams).toString();
            const response = await fetch(\`/api/search/discogs?\${queryString}\`);
            const data = await response.json();

            if (response.ok) {
                this.searchResults = data.results || [];
                this.currentPage = data.pagination?.page || 1;
                this.totalPages = data.pagination?.pages || 1;
                
                this.displaySearchResults();
                this.showStatus('success', \`Found \${this.searchResults.length} results\`);
            } else {
                this.showStatus('error', data.error || 'Search failed');
            }
        } catch (error) {
            console.error('Search failed:', error);
            this.showStatus('error', 'Search failed');
        } finally {
            searchBtn.disabled = false;
            searchBtn.classList.remove('loading');
        }
    }

    displaySearchResults() {
        const resultsSection = document.getElementById('results-section');
        const resultsContainer = document.getElementById('results-container');
        const pagination = document.getElementById('pagination');

        if (this.searchResults.length === 0) {
            resultsSection.classList.add('d-none');
            return;
        }

        resultsSection.classList.remove('d-none');

        // Clear previous results
        resultsContainer.innerHTML = '';

        this.searchResults.forEach((result, index) => {
            const colDiv = document.createElement('div');
            colDiv.className = 'col';

            const cardDiv = document.createElement('div');
            cardDiv.className = 'card h-100 album-card';

            // Use high-resolution image if available, fallback to thumb
            const imageUrl = result.cover_image || result.thumb || '';
            const hasImage = imageUrl && imageUrl !== '';

            cardDiv.innerHTML = \`
                \${hasImage ? 
                    \`<img src="\${imageUrl}" class="card-img-top" alt="\${result.title}" loading="lazy">\` : 
                    '<div class="card-img-top bg-light d-flex align-items-center justify-content-center text-muted" style="height: 200px;"><i class="bi bi-music-note" style="font-size: 3rem;"></i></div>'
                }
                <div class="card-body">
                    <h5 class="card-title">
                        <a class="stretched-link text-dark text-decoration-none" href="#" data-album-id="\${result.id}">
                            \${result.title}
                        </a>
                    </h5>
                    <p class="card-subtitle text-muted mb-2">
                        by \${result.artist || 'Various Artists'}
                    </p>
                    \${result.genre ? \`
                        <div class="mb-2">
                            \${result.genre.map(genre => \`<span class="badge rounded-pill text-bg-primary text-light me-1">\${genre}</span>\`).join('')}
                        </div>
                    \` : ''}
                    \${result.style ? \`
                        <div class="mb-2">
                            \${result.style.map(style => \`<span class="badge rounded-pill text-bg-secondary text-light me-1">\${style}</span>\`).join('')}
                        </div>
                    \` : ''}
                </div>
                <div class="card-footer">
                    <small class="text-muted">
                        \${result.year || 'Unknown Year'}
                        \${result.format ? \` • \${result.format.join(', ')}\` : ''}
                    </small>
                </div>
            \`;

            // Add click event to the card
            cardDiv.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectAlbum(result);
            });

            colDiv.appendChild(cardDiv);
            resultsContainer.appendChild(colDiv);
        });

        // Create pagination
        this.createPagination(pagination);
    }

    createPagination(container) {
        container.innerHTML = '';

        if (this.totalPages <= 1) return;

        const paginationUl = document.createElement('ul');
        paginationUl.className = 'pagination';

        // Previous button
        if (this.currentPage > 1) {
            const prevLi = document.createElement('li');
            prevLi.className = 'page-item';
            prevLi.innerHTML = \`<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>\`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(this.currentPage - 1);
            });
            paginationUl.appendChild(prevLi);
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageLi = document.createElement('li');
            pageLi.className = i === this.currentPage ? 'page-item active' : 'page-item';
            pageLi.innerHTML = \`<a class="page-link" href="#">\${i}</a>\`;
            pageLi.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(i);
            });
            paginationUl.appendChild(pageLi);
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            const nextLi = document.createElement('li');
            nextLi.className = 'page-item';
            nextLi.innerHTML = \`<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>\`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                this.performSearch(this.currentPage + 1);
            });
            paginationUl.appendChild(nextLi);
        }

        container.appendChild(paginationUl);
    }

    async selectAlbum(albumData) {
        try {
            this.showStatus('loading', 'Loading album details...');

            // Get detailed album information
            const response = await fetch(\`/api/search/discogs/release/\${albumData.id}\`);
            const data = await response.json();

            if (response.ok) {
                this.selectedAlbum = data;
                this.displayFullAlbumPage();
                
                // Update URL to use just the release ID
                window.history.pushState({albumData: data}, data.title, \`/albums/\${albumData.id}/\`);
                document.title = \`\${data.title} - RUSS FM SCROBBLER\`;
                
                this.showStatus('success', 'Album loaded successfully');
            } else {
                this.showStatus('error', data.error || 'Failed to load album details');
            }
        } catch (error) {
            console.error('Failed to load album:', error);
            this.showStatus('error', 'Failed to load album details');
        }
    }

    createAlbumSlug(title, id) {
        // No longer needed - keeping for backward compatibility
        return id;
    }

    displayFullAlbumPage() {
        console.log('displayFullAlbumPage called with album:', this.selectedAlbum);
        
        // Hide search sections and show full album page
        const resultsSection = document.getElementById('results-section');
        if (resultsSection) {
            resultsSection.classList.add('d-none');
            console.log('Hidden results section');
        }
        
        // Hide the search card and jumbotron when showing full album page
        const searchCards = document.querySelectorAll('.card');
        const jumbotron = document.querySelector('.jumbotron-background');
        
        // Hide all existing cards (search form, results, etc.)
        searchCards.forEach(card => {
            card.classList.add('d-none');
        });
        console.log('Hidden search cards');
        
        if (jumbotron) {
            jumbotron.classList.add('d-none');
            console.log('Hidden jumbotron');
        }
        
        const container = document.querySelector('.container.my-5');
        if (!container) {
            console.error('Could not find .container.my-5 element');
            return;
        }
        
        console.log('About to replace container innerHTML');
        
        // Create a new album page container
        const albumPageHTML = \`
            <div class="container mt-4">
                <!-- Breadcrumbs -->
                <nav aria-label="breadcrumb" class="mb-4">
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item"><a href="/">Albums</a></li>
                        <li class="breadcrumb-item active" aria-current="page">\${this.selectedAlbum.title}</li>
                    </ol>
                </nav>
                <div class="row justify-content-center">
                    <div class="col-12 col-md-8 col-lg-6">
                        <!-- Album Cover -->
                    <img src="\${this.selectedAlbum.images && this.selectedAlbum.images[0] ? this.selectedAlbum.images[0].uri : '/placeholder-album.jpg'}" 
                         alt="\${this.selectedAlbum.title}" 
                         class="img-fluid rounded shadow-lg mb-4 w-100">
                    
                    <!-- Artist/Genre/Style Badges -->
                    <div class="d-flex flex-wrap mb-4">
                        \${this.selectedAlbum.artists ? this.selectedAlbum.artists.map(artist => \`
                            <div class="d-flex align-items-center p-1">
                                <div class="d-flex">
                                    <span class="bg-primary text-white small px-2 py-1 rounded-start">Artist</span>
                                    <span class="bg-secondary text-white small px-2 py-1 rounded-end">\${artist.name}</span>
                                </div>
                            </div>
                        \`).join('') : ''}
                        
                        \${this.selectedAlbum.genres ? this.selectedAlbum.genres.map(genre => \`
                            <div class="d-flex align-items-center p-1">
                                <div class="d-flex">
                                    <span class="bg-primary text-white small px-2 py-1 rounded-start">Genre</span>
                                    <span class="bg-secondary text-white small px-2 py-1 rounded-end">\${genre}</span>
                                </div>
                            </div>
                        \`).join('') : ''}
                        
                        \${this.selectedAlbum.styles ? this.selectedAlbum.styles.map(style => \`
                            <div class="d-flex align-items-center p-1">
                                <div class="d-flex">
                                    <span class="bg-primary text-white small px-2 py-1 rounded-start">Style</span>
                                    <span class="bg-secondary text-white small px-2 py-1 rounded-end">\${style}</span>
                                </div>
                            </div>
                        \`).join('') : ''}
                    </div>

                    <!-- Scrobble Button -->
                    <button id="scrobble-album-btn" class="btn btn-danger btn-block mb-4 w-100">
                        <i class="bi bi-file-music-fill me-2"></i>
                        Scrobble "\${this.selectedAlbum.title}" to Last.fm
                    </button>

                    <!-- Album Information -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h3 class="mb-0">\${this.selectedAlbum.title}</h3>
                            <p class="text-muted mb-0">by \${this.selectedAlbum.artists ? this.selectedAlbum.artists.map(a => a.name).join(', ') : 'Various Artists'}</p>
                        </div>
                        <div class="card-body">
                            <div class="row g-3">
                                \${this.selectedAlbum.year ? \`
                                    <div class="col-sm-6">
                                        <strong>Year:</strong> \${this.selectedAlbum.year}
                                    </div>
                                \` : ''}
                                \${this.selectedAlbum.formats ? \`
                                    <div class="col-sm-6">
                                        <strong>Format:</strong> \${this.selectedAlbum.formats.map(f => f.name).join(', ')}
                                    </div>
                                \` : ''}
                                \${this.selectedAlbum.labels ? \`
                                    <div class="col-sm-6">
                                        <strong>Label:</strong> \${this.selectedAlbum.labels.map(l => l.name).join(', ')}
                                    </div>
                                \` : ''}
                                \${this.selectedAlbum.country ? \`
                                    <div class="col-sm-6">
                                        <strong>Country:</strong> \${this.selectedAlbum.country}
                                    </div>
                                \` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Track List -->
                    \${this.selectedAlbum.tracklist && this.selectedAlbum.tracklist.length > 0 ? \`
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">
                                    <i class="bi bi-music-note-list me-2"></i>
                                    Track List
                                </h5>
                            </div>
                            <div class="card-body p-0">
                                \${this.selectedAlbum.tracklist.map((track, index) => {
                                    if (track.type_ === 'track') {
                                        return \`
                                            <div class="track-item d-flex align-items-center justify-content-between">
                                                <div class="d-flex align-items-center flex-grow-1">
                                                    <span class="badge bg-secondary me-3">\${track.position || (index + 1)}</span>
                                                    <span class="fw-medium">\${track.title}</span>
                                                    \${track.duration ? \`<span class="text-muted ms-auto me-3">(\${track.duration})</span>\` : ''}
                                                </div>
                                                <button class="btn btn-primary btn-sm" onclick="app.scrobbleTrack(\${index})">
                                                    <i class="bi bi-music-note me-1"></i>Scrobble
                                                </button>
                                            </div>
                                        \`;
                                    }
                                    return '';
                                }).join('')}
                            </div>
                        </div>
                    \` : ''}

                    <!-- Back Button -->
                    <div class="text-center">
                        <button id="back-to-search" class="btn btn-secondary">
                            <i class="bi bi-arrow-left me-1"></i>
                            Back to Search
                        </button>
                    </div>

                    <!-- Status Messages -->
                    <div id="album-status" class="mt-3 d-none"></div>
                </div>
            </div>
        \`;
        
        // Replace the container content
        container.innerHTML = albumPageHTML;
        console.log('Container innerHTML replaced successfully');

        // Bind events for the new page
        const scrobbleBtn = document.getElementById('scrobble-album-btn');
        const backBtn = document.getElementById('back-to-search');
        
        if (scrobbleBtn) {
            scrobbleBtn.addEventListener('click', () => this.scrobbleAlbum());
            console.log('Bound scrobble button event');
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', () => this.backToSearch());
            console.log('Bound back button event');
        }

        // Scroll to top
        window.scrollTo(0, 0);
        console.log('displayFullAlbumPage completed successfully');
    }

    backToSearch() {
        // Update URL to home page
        window.history.pushState({}, 'RUSS FM SCROBBLER', '/');
        
        // Restore original page content
        location.reload();
    }

    async scrobbleTrack(trackIndex) {
        if (!this.currentUser) {
            this.showAlbumStatus('error', 'Please log in to Last.fm first');
            return;
        }

        const track = this.selectedAlbum.tracklist[trackIndex];
        if (!track || track.type_ !== 'track') return;

        try {
            const scrobbleData = {
                artist: this.selectedAlbum.artists ? this.selectedAlbum.artists[0].name : 'Unknown Artist',
                track: track.title,
                album: this.selectedAlbum.title,
                timestamp: Math.floor(Date.now() / 1000)
            };

            const response = await fetch('/api/scrobble/track', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(scrobbleData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlbumStatus('success', \`Scrobbled: \${track.title}\`);
            } else {
                this.showAlbumStatus('error', data.error || 'Scrobble failed');
            }
        } catch (error) {
            console.error('Scrobble failed:', error);
            this.showAlbumStatus('error', 'Scrobble failed');
        }
    }

    async scrobbleAlbum() {
        if (!this.currentUser) {
            this.showAlbumStatus('error', 'Please log in to Last.fm first');
            return;
        }

        if (!this.selectedAlbum || !this.selectedAlbum.tracklist) {
            this.showAlbumStatus('error', 'No album selected');
            return;
        }

        const tracks = this.selectedAlbum.tracklist.filter(track => track.type_ === 'track');
        if (tracks.length === 0) {
            this.showAlbumStatus('error', 'No tracks found in album');
            return;
        }

        try {
            const scrobbleBtn = document.getElementById('scrobble-album-btn');
            scrobbleBtn.disabled = true;
            scrobbleBtn.classList.add('loading');

            this.showAlbumStatus('loading', \`Scrobbling \${tracks.length} tracks...\`);

            const albumData = {
                artist: this.selectedAlbum.artists ? this.selectedAlbum.artists[0].name : 'Unknown Artist',
                album: this.selectedAlbum.title,
                tracks: tracks.map(track => ({
                    title: track.title,
                    duration: track.duration
                }))
            };

            const response = await fetch('/api/scrobble/album', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(albumData)
            });

            const data = await response.json();

            if (response.ok) {
                this.showAlbumStatus('success', \`Successfully scrobbled \${tracks.length} tracks!\`);
            } else {
                this.showAlbumStatus('error', data.error || 'Album scrobble failed');
            }
        } catch (error) {
            console.error('Album scrobble failed:', error);
            this.showAlbumStatus('error', 'Album scrobble failed');
        } finally {
            const scrobbleBtn = document.getElementById('scrobble-album-btn');
            if (scrobbleBtn) {
                scrobbleBtn.disabled = false;
                scrobbleBtn.classList.remove('loading');
            }
        }
    }

    clearSelection() {
        this.selectedAlbum = null;
        document.getElementById('album-section').classList.add('d-none');
        this.showStatus('success', 'Selection cleared');
    }

    showStatus(type, message) {
        const statusElement = document.getElementById('search-status');
        statusElement.innerHTML = \`<div class="alert \${this.getStatusClasses(type)} mb-0">\${message}</div>\`;
        statusElement.classList.remove('d-none');
    }

    showAlbumStatus(type, message) {
        const statusElement = document.getElementById('album-status');
        if (statusElement) {
            statusElement.innerHTML = \`<div class="alert \${this.getStatusClasses(type)} mb-0">\${message}</div>\`;
            statusElement.classList.remove('d-none');
        }
    }

    getStatusClasses(type) {
        switch(type) {
            case 'success':
                return 'alert-success';
            case 'error':
                return 'alert-danger';
            case 'warning':
                return 'alert-warning';
            case 'loading':
                return 'alert-info';
            default:
                return 'alert-secondary';
        }
    }

    handleDirectAlbumURL() {
        // Check if we're on a direct album URL like /albums/34201738/
        const path = window.location.pathname;
        console.log('handleDirectAlbumURL - Current path:', path);
        
        // Use string methods to parse the URL
        if (path.includes('/albums/')) {
            const pathParts = path.split('/').filter(part => part.length > 0);
            console.log('Path parts:', pathParts);
            
            const albumIndex = pathParts.indexOf('albums');
            if (albumIndex !== -1 && albumIndex < pathParts.length - 1) {
                const releaseId = pathParts[albumIndex + 1];
                console.log('Extracted release ID:', releaseId);
                
                // Check if it's a valid number
                if (releaseId && !isNaN(releaseId)) {
                    console.log('Valid release ID found:', releaseId);
                    this.loadAlbumDirectly(releaseId);
                    return;
                }
            }
        }
        console.log('No album URL match found');
    }

    async loadAlbumDirectly(releaseId) {
        try {
            console.log('Loading album directly for release ID:', releaseId);
            this.showStatus('loading', 'Loading album...');

            // Get detailed album information directly
            const response = await fetch(\`/api/search/discogs/release/\${releaseId}\`);
            console.log('API response status:', response.status);
            const data = await response.json();
            console.log('API response data:', data);

            if (response.ok) {
                this.selectedAlbum = data;
                console.log('About to display full album page');
                this.displayFullAlbumPage();
                document.title = \`\${data.title} - RUSS FM SCROBBLER\`;
                console.log('Album page should be displayed');
            } else {
                console.error('API error:', data.error);
                this.showStatus('error', data.error || 'Album not found');
                // Redirect to home page after a delay
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            }
        } catch (error) {
            console.error('Failed to load album directly:', error);
            this.showStatus('error', 'Failed to load album');
            // Redirect to home page after a delay
            setTimeout(() => {
                window.location.href = '/';
            }, 3000);
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    
    // Handle auth callback first
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('token')) {
        // This is an auth callback, handle it
        fetch('/api/auth/callback' + window.location.search, { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove token from URL and reload
                    window.history.replaceState({}, document.title, window.location.pathname);
                    window.location.reload();
                } else {
                    alert('Authentication failed: ' + (data.error || 'Unknown error'));
                }
            })
            .catch(error => {
                console.error('Auth callback failed:', error);
                alert('Authentication failed');
            });
    } else {
        // No auth callback, initialize the app normally
        window.app = new ScrobblerApp();
    }
});`; 