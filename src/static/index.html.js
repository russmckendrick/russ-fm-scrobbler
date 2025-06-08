export const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RUSS FM SCROBBLER</title>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><a href="/">RUSS FM SCROBBLER</a></h1>
            <div class="user-status">
                <span id="user-info">Not logged in</span>
                <button id="login-btn" class="btn">LOGIN TO LAST.FM</button>
                <button id="logout-btn" class="btn" style="display: none;">LOGOUT</button>
            </div>
        </div>
    </header>

    <main class="container">
        <section class="search-section">
            <h2>SEARCH FOR MUSIC</h2>
            
            <div class="search-controls">
                <div class="search-type">
                    <label>
                        <input type="radio" name="search-type" value="release-id" checked>
                        DISCOGS RELEASE ID
                    </label>
                    <label>
                        <input type="radio" name="search-type" value="artist-album">
                        ARTIST + ALBUM NAME
                    </label>
                </div>

                <div class="search-inputs">
                    <div id="release-id-input" class="input-group">
                        <input type="text" id="release-id" placeholder="Enter Discogs Release ID (e.g., 123456)">
                    </div>
                    
                    <div id="artist-album-input" class="input-group" style="display: none;">
                        <input type="text" id="artist-name" placeholder="Artist name">
                        <input type="text" id="album-name" placeholder="Album name">
                    </div>
                </div>

                <button id="search-btn" class="btn btn-primary">SEARCH</button>
            </div>

            <div id="search-status" class="status-message"></div>
        </section>

        <section class="results-section" id="results-section" style="display: none;">
            <h2>SEARCH RESULTS</h2>
            <div id="results-container"></div>
            <div id="pagination" class="pagination"></div>
        </section>

        <section class="album-section" id="album-section" style="display: none;">
            <h2>SELECTED ALBUM</h2>
            <div id="album-details"></div>
            <div id="track-list"></div>
            <div class="scrobble-controls">
                <button id="scrobble-all-btn" class="btn btn-primary">SCROBBLE ENTIRE ALBUM</button>
                <button id="clear-selection-btn" class="btn">CLEAR SELECTION</button>
            </div>
            <div id="scrobble-status" class="status-message"></div>
        </section>
    </main>

    <footer>
        <div class="container">
            <p>
                POWERED BY 
                <a href="https://www.discogs.com/developers" target="_blank">DISCOGS API</a> 
                & 
                <a href="https://www.last.fm/api" target="_blank">LAST.FM API</a>
            </p>
            <p>
                <a href="https://github.com/yourusername/russ-fm-scrobbler" target="_blank">SOURCE CODE</a>
            </p>
        </div>
    </footer>

    <script src="/script.js"></script>
</body>
</html>`; 