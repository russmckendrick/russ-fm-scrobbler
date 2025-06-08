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
            userInfo.textContent = \`LOGGED IN AS \${this.currentUser.username.toUpperCase()}\`;
            loginBtn.style.display = 'none';
            logoutBtn.style.display = 'inline-block';
        } else {
            userInfo.textContent = 'NOT LOGGED IN';
            loginBtn.style.display = 'inline-block';
            logoutBtn.style.display = 'none';
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
            releaseIdInput.style.display = 'block';
            artistAlbumInput.style.display = 'none';
        } else {
            releaseIdInput.style.display = 'none';
            artistAlbumInput.style.display = 'block';
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
            resultsSection.style.display = 'none';
            return;
        }

        resultsSection.style.display = 'block';

        // Create results grid
        const resultsGrid = document.createElement('div');
        resultsGrid.className = 'results-grid';

        this.searchResults.forEach((result, index) => {
            const resultItem = document.createElement('div');
            resultItem.className = 'result-item';
            resultItem.addEventListener('click', () => this.selectAlbum(result));

            resultItem.innerHTML = \`
                \${result.thumb ? \`<img src="\${result.thumb}" alt="\${result.title}" loading="lazy">\` : ''}
                <h3>\${result.title}</h3>
                <div class="artist">\${result.artist || 'Various Artists'}</div>
                <div class="year">\${result.year || 'Unknown Year'}</div>
                \${result.format ? \`<div class="text-small text-muted">\${result.format.join(', ')}</div>\` : ''}
            \`;

            resultsGrid.appendChild(resultItem);
        });

        resultsContainer.innerHTML = '';
        resultsContainer.appendChild(resultsGrid);

        // Create pagination
        this.createPagination(pagination);
    }

    createPagination(container) {
        container.innerHTML = '';

        if (this.totalPages <= 1) return;

        // Previous button
        if (this.currentPage > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn';
            prevBtn.textContent = 'PREV';
            prevBtn.addEventListener('click', () => this.performSearch(this.currentPage - 1));
            container.appendChild(prevBtn);
        }

        // Page numbers
        const startPage = Math.max(1, this.currentPage - 2);
        const endPage = Math.min(this.totalPages, this.currentPage + 2);

        for (let i = startPage; i <= endPage; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.className = i === this.currentPage ? 'btn btn-primary' : 'btn';
            pageBtn.textContent = i;
            pageBtn.addEventListener('click', () => this.performSearch(i));
            container.appendChild(pageBtn);
        }

        // Next button
        if (this.currentPage < this.totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn';
            nextBtn.textContent = 'NEXT';
            nextBtn.addEventListener('click', () => this.performSearch(this.currentPage + 1));
            container.appendChild(nextBtn);
        }
    }

    async selectAlbum(albumData) {
        try {
            this.showStatus('loading', 'Loading album details...');

            // Get detailed album information
            const response = await fetch(\`/api/search/discogs/release/\${albumData.id}\`);
            const data = await response.json();

            if (response.ok) {
                this.selectedAlbum = data;
                this.displayAlbumDetails();
                this.showStatus('success', 'Album loaded successfully');
            } else {
                this.showStatus('error', data.error || 'Failed to load album details');
            }
        } catch (error) {
            console.error('Failed to load album:', error);
            this.showStatus('error', 'Failed to load album details');
        }
    }

    displayAlbumDetails() {
        const albumSection = document.getElementById('album-section');
        const albumDetails = document.getElementById('album-details');
        const trackList = document.getElementById('track-list');

        albumSection.style.display = 'block';

        // Album info
        const albumInfo = document.createElement('div');
        albumInfo.className = 'album-info';
        albumInfo.innerHTML = \`
            <div class="album-artwork">
                \${this.selectedAlbum.images && this.selectedAlbum.images[0] ? 
                    \`<img src="\${this.selectedAlbum.images[0].uri}" alt="\${this.selectedAlbum.title}">\` : 
                    '<div class="no-image">NO IMAGE</div>'
                }
            </div>
            <div class="album-meta">
                <h3>\${this.selectedAlbum.title}</h3>
                <div class="artist">\${this.selectedAlbum.artists ? this.selectedAlbum.artists.map(a => a.name).join(', ') : 'Various Artists'}</div>
                <div class="details">
                    \${this.selectedAlbum.year ? \`<div>YEAR: \${this.selectedAlbum.year}</div>\` : ''}
                    \${this.selectedAlbum.genres ? \`<div>GENRES: \${this.selectedAlbum.genres.join(', ')}</div>\` : ''}
                    \${this.selectedAlbum.styles ? \`<div>STYLES: \${this.selectedAlbum.styles.join(', ')}</div>\` : ''}
                    \${this.selectedAlbum.formats ? \`<div>FORMAT: \${this.selectedAlbum.formats.map(f => f.name).join(', ')}</div>\` : ''}
                    \${this.selectedAlbum.labels ? \`<div>LABEL: \${this.selectedAlbum.labels.map(l => l.name).join(', ')}</div>\` : ''}
                </div>
            </div>
        \`;

        albumDetails.innerHTML = '';
        albumDetails.appendChild(albumInfo);

        // Track list
        if (this.selectedAlbum.tracklist && this.selectedAlbum.tracklist.length > 0) {
            const trackListDiv = document.createElement('div');
            trackListDiv.className = 'track-list';
            trackListDiv.innerHTML = '<h3>TRACK LIST</h3>';

            this.selectedAlbum.tracklist.forEach((track, index) => {
                if (track.type_ === 'track') {
                    const trackItem = document.createElement('div');
                    trackItem.className = 'track-item';
                    trackItem.innerHTML = \`
                        <div class="track-info">
                            <span class="track-number">\${track.position || (index + 1)}</span>
                            <span class="track-title">\${track.title}</span>
                            \${track.duration ? \`<span class="track-duration">(\${track.duration})</span>\` : ''}
                        </div>
                        <button class="btn track-scrobble-btn" onclick="app.scrobbleTrack(\${index})">SCROBBLE</button>
                    \`;
                    trackListDiv.appendChild(trackItem);
                }
            });

            trackList.innerHTML = '';
            trackList.appendChild(trackListDiv);
        } else {
            trackList.innerHTML = '<div class="text-muted">NO TRACK INFORMATION AVAILABLE</div>';
        }

        // Scroll to album section
        albumSection.scrollIntoView({ behavior: 'smooth' });
    }

    async scrobbleTrack(trackIndex) {
        if (!this.currentUser) {
            this.showStatus('error', 'Please log in to Last.fm first');
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
                this.showScrobbleStatus('success', \`Scrobbled: \${track.title}\`);
            } else {
                this.showScrobbleStatus('error', data.error || 'Scrobble failed');
            }
        } catch (error) {
            console.error('Scrobble failed:', error);
            this.showScrobbleStatus('error', 'Scrobble failed');
        }
    }

    async scrobbleAlbum() {
        if (!this.currentUser) {
            this.showStatus('error', 'Please log in to Last.fm first');
            return;
        }

        if (!this.selectedAlbum || !this.selectedAlbum.tracklist) {
            this.showScrobbleStatus('error', 'No album selected');
            return;
        }

        const tracks = this.selectedAlbum.tracklist.filter(track => track.type_ === 'track');
        if (tracks.length === 0) {
            this.showScrobbleStatus('error', 'No tracks found in album');
            return;
        }

        try {
            const scrobbleBtn = document.getElementById('scrobble-all-btn');
            scrobbleBtn.disabled = true;
            scrobbleBtn.classList.add('loading');

            this.showScrobbleStatus('loading', \`Scrobbling \${tracks.length} tracks...\`);

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
                this.showScrobbleStatus('success', \`Successfully scrobbled \${tracks.length} tracks!\`);
            } else {
                this.showScrobbleStatus('error', data.error || 'Album scrobble failed');
            }
        } catch (error) {
            console.error('Album scrobble failed:', error);
            this.showScrobbleStatus('error', 'Album scrobble failed');
        } finally {
            const scrobbleBtn = document.getElementById('scrobble-all-btn');
            scrobbleBtn.disabled = false;
            scrobbleBtn.classList.remove('loading');
        }
    }

    clearSelection() {
        this.selectedAlbum = null;
        document.getElementById('album-section').style.display = 'none';
        this.showStatus('success', 'Selection cleared');
    }

    showStatus(type, message) {
        const statusElement = document.getElementById('search-status');
        statusElement.textContent = message;
        statusElement.className = \`status-message \${type}\`;
    }

    showScrobbleStatus(type, message) {
        const statusElement = document.getElementById('scrobble-status');
        statusElement.textContent = message;
        statusElement.className = \`status-message \${type}\`;
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ScrobblerApp();
});

// Handle auth callback
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
}`; 