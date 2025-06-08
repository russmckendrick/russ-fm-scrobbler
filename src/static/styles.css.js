export const CSS_CONTENT = `/* RUSS FM SCROBBLER - BRUTALIST STYLES */

/* CSS RESET & BASE */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --bg-color: #000000;
    --text-color: #ffffff;
    --accent-color: #ff0000;
    --border-color: #333333;
    --input-bg: #111111;
    --button-bg: #222222;
    --button-hover: #333333;
    --success-color: #00ff00;
    --error-color: #ff0000;
    --warning-color: #ffff00;
}

body {
    font-family: 'Courier New', 'Monaco', 'Menlo', monospace;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.4;
    font-size: 14px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* TYPOGRAPHY */
h1, h2, h3 {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

h1 {
    font-size: 24px;
    margin-bottom: 20px;
}

h2 {
    font-size: 18px;
    margin-bottom: 15px;
    border-bottom: 2px solid var(--accent-color);
    padding-bottom: 5px;
}

h3 {
    font-size: 16px;
    margin-bottom: 10px;
}

a {
    color: var(--text-color);
    text-decoration: underline;
}

a:hover {
    color: var(--accent-color);
}

/* LAYOUT */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

header {
    border-bottom: 2px solid var(--border-color);
    padding: 20px 0;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
}

header h1 a {
    text-decoration: none;
    color: var(--text-color);
}

header h1 a:hover {
    color: var(--accent-color);
}

main {
    flex: 1;
    padding: 40px 0;
}

footer {
    border-top: 2px solid var(--border-color);
    padding: 20px 0;
    text-align: center;
    font-size: 12px;
}

footer p {
    margin-bottom: 5px;
}

/* SECTIONS */
section {
    margin-bottom: 40px;
    border: 1px solid var(--border-color);
    padding: 20px;
}

/* USER STATUS */
.user-status {
    display: flex;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
}

#user-info {
    font-weight: bold;
}

/* BUTTONS */
.btn {
    background-color: var(--button-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 10px 15px;
    font-family: inherit;
    font-size: 12px;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.2s;
}

.btn:hover {
    background-color: var(--button-hover);
}

.btn:active {
    background-color: var(--accent-color);
}

.btn-primary {
    background-color: var(--accent-color);
    color: var(--bg-color);
    font-weight: bold;
}

.btn-primary:hover {
    background-color: #cc0000;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* FORMS */
.search-controls {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.search-type {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
}

.search-type label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
}

.search-type input[type="radio"] {
    accent-color: var(--accent-color);
}

.input-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input[type="text"] {
    background-color: var(--input-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    padding: 12px;
    font-family: inherit;
    font-size: 14px;
    width: 100%;
}

input[type="text"]:focus {
    outline: none;
    border-color: var(--accent-color);
}

input[type="text"]::placeholder {
    color: #666666;
}

/* STATUS MESSAGES */
.status-message {
    margin-top: 15px;
    padding: 10px;
    border: 1px solid var(--border-color);
    font-weight: bold;
    text-transform: uppercase;
    font-size: 12px;
}

.status-message.success {
    background-color: var(--success-color);
    color: var(--bg-color);
}

.status-message.error {
    background-color: var(--error-color);
    color: var(--text-color);
}

.status-message.warning {
    background-color: var(--warning-color);
    color: var(--bg-color);
}

.status-message.loading {
    background-color: var(--button-bg);
    color: var(--text-color);
}

/* RESULTS */
.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-bottom: 20px;
}

.result-item {
    border: 1px solid var(--border-color);
    padding: 15px;
    cursor: pointer;
    transition: border-color 0.2s;
}

.result-item:hover {
    border-color: var(--accent-color);
}

.result-item.selected {
    border-color: var(--accent-color);
    background-color: var(--input-bg);
}

.result-item img {
    width: 100%;
    max-width: 150px;
    height: auto;
    margin-bottom: 10px;
    border: 1px solid var(--border-color);
}

.result-item h3 {
    margin-bottom: 5px;
}

.result-item .artist {
    font-weight: bold;
    margin-bottom: 3px;
}

.result-item .year {
    color: #888888;
    font-size: 12px;
}

/* ALBUM DETAILS */
.album-info {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    flex-wrap: wrap;
}

.album-artwork {
    flex-shrink: 0;
}

.album-artwork img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border: 1px solid var(--border-color);
}

.album-meta {
    flex: 1;
    min-width: 300px;
}

.album-meta h3 {
    font-size: 20px;
    margin-bottom: 10px;
}

.album-meta .artist {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 5px;
}

.album-meta .details {
    font-size: 12px;
    color: #888888;
    line-height: 1.6;
}

/* TRACK LIST */
.track-list {
    border: 1px solid var(--border-color);
    margin-bottom: 20px;
}

.track-list h3 {
    background-color: var(--button-bg);
    padding: 10px;
    margin: 0;
    border-bottom: 1px solid var(--border-color);
}

.track-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    transition: background-color 0.2s;
}

.track-item:last-child {
    border-bottom: none;
}

.track-item:hover {
    background-color: var(--input-bg);
}

.track-info {
    flex: 1;
}

.track-number {
    font-weight: bold;
    margin-right: 10px;
    color: #888888;
}

.track-title {
    font-weight: bold;
}

.track-duration {
    color: #888888;
    font-size: 12px;
    margin-left: 10px;
}

.track-scrobble-btn {
    padding: 5px 10px;
    font-size: 10px;
}

/* SCROBBLE CONTROLS */
.scrobble-controls {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    margin-bottom: 20px;
}

/* PAGINATION */
.pagination {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
}

.pagination .btn {
    padding: 8px 12px;
    font-size: 11px;
}

/* RESPONSIVE DESIGN */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    header .container {
        flex-direction: column;
        text-align: center;
    }
    
    .search-type {
        flex-direction: column;
        gap: 10px;
    }
    
    .album-info {
        flex-direction: column;
    }
    
    .album-artwork img {
        width: 150px;
        height: 150px;
    }
    
    .results-grid {
        grid-template-columns: 1fr;
    }
    
    .track-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    
    .scrobble-controls {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    body {
        font-size: 12px;
    }
    
    h1 {
        font-size: 20px;
    }
    
    h2 {
        font-size: 16px;
    }
    
    section {
        padding: 15px;
    }
    
    .btn {
        padding: 8px 12px;
        font-size: 11px;
    }
}

/* LOADING ANIMATION */
.loading {
    position: relative;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 10px;
    width: 12px;
    height: 12px;
    border: 2px solid var(--border-color);
    border-top: 2px solid var(--accent-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* UTILITY CLASSES */
.hidden {
    display: none !important;
}

.text-center {
    text-align: center;
}

.text-small {
    font-size: 11px;
}

.text-muted {
    color: #888888;
}

.mb-10 {
    margin-bottom: 10px;
}

.mb-20 {
    margin-bottom: 20px;
}`; 