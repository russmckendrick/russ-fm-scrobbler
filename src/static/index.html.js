export const HTML_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RUSS FM SCROBBLER</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body class="d-flex flex-column min-vh-100">
    <!-- Header -->
    <header class="main-header">
        <nav class="navbar navbar-expand-lg fixed-top">
            <div class="container">
                <!-- Brand -->
                <a class="navbar-brand" href="/">
                    <img src="https://www.russ.fm/images/record.svg" alt="logo" width="30" height="24" class="d-inline-block align-text-top navbar-icon me-2">
                    russFM
                </a>

                <!-- Menu Toggler -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Main Menu -->
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/">Scrobbler</a>
                        </li>
                    </ul>

                    <!-- Auth Section -->
                    <div class="d-flex align-items-center gap-3">
                        <span id="user-info" class="text-light small">Not logged in</span>
                        <button id="login-btn" class="btn btn-secondary btn-sm">
                            <i class="bi bi-box-arrow-in-right me-1"></i>
                            Login to Last.fm
                        </button>
                        <button id="logout-btn" class="btn btn-outline-light btn-sm d-none">
                            <i class="bi bi-box-arrow-right me-1"></i>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    </header>

    <!-- Main Content -->
    <div id="content" class="flex-fill">
        <div class="container my-5">
            <!-- Jumbotron Header -->
            <div class="bg-primary text-light rounded-3 d-flex flex-column-reverse flex-md-column flex-lg-row align-items-center jumbotron-background mb-5">
                <div class="text-container p-5">
                    <h1 class="display-4">Music Scrobbler</h1>
                    <p class="lead">Search for albums on Discogs and scrobble them to Last.fm</p>
                </div>
            </div>

            <!-- Search Section -->
            <div class="card mb-4">
                <div class="card-body">
                    <h2 class="card-title h4 mb-4">
                        <i class="bi bi-search me-2"></i>
                        Search for Music
                    </h2>
                    
                    <div class="row">
                        <div class="col-md-8">
                            <!-- Search Type Toggle -->
                            <div class="mb-3">
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="search-type" id="release-id-radio" value="release-id" checked>
                                    <label class="form-check-label" for="release-id-radio">
                                        Discogs Release ID
                                    </label>
                                </div>
                                <div class="form-check form-check-inline">
                                    <input class="form-check-input" type="radio" name="search-type" id="artist-album-radio" value="artist-album">
                                    <label class="form-check-label" for="artist-album-radio">
                                        Artist + Album Name
                                    </label>
                                </div>
                            </div>

                            <!-- Search Inputs -->
                            <div id="release-id-input" class="mb-3">
                                <input type="text" id="release-id" class="form-control" placeholder="Enter Discogs Release ID (e.g., 123456)">
                            </div>
                            
                            <div id="artist-album-input" class="d-none">
                                <div class="mb-3">
                                    <input type="text" id="artist-name" class="form-control" placeholder="Artist name">
                                </div>
                                <div class="mb-3">
                                    <input type="text" id="album-name" class="form-control" placeholder="Album name">
                                </div>
                            </div>

                            <!-- Search Button -->
                            <button id="search-btn" class="btn btn-primary">
                                <i class="bi bi-search me-1"></i>
                                Search
                            </button>

                            <!-- Status Message -->
                            <div id="search-status" class="mt-3 d-none"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Results Section -->
            <div id="results-section" class="card mb-4 d-none">
                <div class="card-body">
                    <h2 class="card-title h4 mb-4">
                        <i class="bi bi-collection me-2"></i>
                        Search Results
                    </h2>
                    <div id="results-container" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4"></div>
                    <nav aria-label="Search results pagination" class="mt-4">
                        <div id="pagination" class="d-flex justify-content-center"></div>
                    </nav>
                </div>
            </div>

            <!-- Album Details Section -->
            <div id="album-section" class="card mb-4 d-none">
                <div class="card-body">
                    <h2 class="card-title h4 mb-4">
                        <i class="bi bi-vinyl me-2"></i>
                        Selected Album
                    </h2>
                    <div id="album-details" class="row mb-4"></div>
                    <div id="track-list" class="mb-4"></div>
                    <div class="d-flex gap-2 flex-wrap justify-content-center">
                        <button id="scrobble-all-btn" class="btn btn-primary btn-lg">
                            <i class="bi bi-music-note-list me-1"></i>
                            Scrobble Entire Album
                        </button>
                        <button id="clear-selection-btn" class="btn btn-secondary">
                            <i class="bi bi-x-circle me-1"></i>
                            Clear Selection
                        </button>
                    </div>
                    <div id="scrobble-status" class="mt-3 d-none"></div>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-light py-4 mt-auto">
        <div class="container text-center">
            <p class="mb-2">
                Powered by 
                <a href="https://www.discogs.com/developers" target="_blank" class="text-light">Discogs API</a> 
                & 
                <a href="https://www.last.fm/api" target="_blank" class="text-light">Last.fm API</a>
            </p>
            <p class="mb-0">
                <a href="https://github.com/yourusername/russ-fm-scrobbler" target="_blank" class="text-light">
                    <i class="bi bi-github me-1"></i>
                    Source Code
                </a>
            </p>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="/script.js"></script>
</body>
</html>`