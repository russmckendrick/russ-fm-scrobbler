export const CSS_CONTENT = `/* RUSS FM SCROBBLER - INSPIRED BY RANDOM.RUSS.FM */

/* CSS RESET & BASE */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    --background: #242424;
    --accent: #e74c3c;
    --text-color: #ffffff;
    --card-bg: rgba(255,255,255,0.1);
    --border-color: rgba(255,255,255,0.1);
    --input-bg: rgba(255,255,255,0.05);
    --button-bg: #3498db;
    --button-hover: #2980b9;
    --success-color: #27ae60;
    --error-color: #e74c3c;
    --warning-color: #f39c12;
    --shadow: 0 8px 32px rgba(0,0,0,0.4);
    --text-shadow: 0 2px 4px rgba(0,0,0,0.5);
}

body {
    font-family: 'Segoe UI', Arial, sans-serif;
    background: var(--background);
    color: var(--text-color);
    line-height: 1.6;
    font-size: 16px;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

/* TYPOGRAPHY */
h1, h2, h3 {
    font-weight: 600;
    text-shadow: var(--text-shadow);
}

h1 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 2rem;
    margin-bottom: 1.5rem;
    color: var(--accent);
}

h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

a {
    color: var(--text-color);
    text-decoration: none;
    transition: color 0.3s ease;
}

a:hover {
    color: var(--accent);
}

/* LAYOUT */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

header {
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border-color);
    padding: 1.5rem 0;
    position: sticky;
    top: 0;
    z-index: 100;
}

header .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1.5rem;
}

header h1 a {
    text-decoration: none;
    color: var(--text-color);
    font-size: 1.8rem;
    font-weight: 600;
}

header h1 a:hover {
    color: var(--accent);
}

main {
    flex: 1;
    padding: 3rem 0;
}

footer {
    background: rgba(0,0,0,0.2);
    backdrop-filter: blur(10px);
    border-top: 1px solid var(--border-color);
    padding: 2rem 0;
    text-align: center;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
}

footer p {
    margin-bottom: 0.5rem;
}

/* SECTIONS */
section {
    margin-bottom: 3rem;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    padding: 2rem;
    box-shadow: var(--shadow);
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
    background: var(--button-bg);
    color: var(--text-color);
    border: none;
    padding: 0.75rem 1.5rem;
    font-family: inherit;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.btn:hover {
    background: var(--button-hover);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.5);
}

.btn:active {
    transform: translateY(0);
}

.btn-primary {
    background: var(--accent);
    color: white;
    font-weight: 600;
}

.btn-primary:hover {
    background: #c0392b;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
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
    background: var(--input-bg);
    color: var(--text-color);
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    font-family: inherit;
    font-size: 1rem;
    width: 100%;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
}

input[type="text"]:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
    background: rgba(255,255,255,0.1);
}

input[type="text"]::placeholder {
    color: rgba(255,255,255,0.5);
}

/* STATUS MESSAGES */
.status-message {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.9rem;
    backdrop-filter: blur(10px);
    border: 1px solid var(--border-color);
}

.status-message.success {
    background: rgba(39, 174, 96, 0.2);
    color: #2ecc71;
    border-color: rgba(39, 174, 96, 0.3);
}

.status-message.error {
    background: rgba(231, 76, 60, 0.2);
    color: #e74c3c;
    border-color: rgba(231, 76, 60, 0.3);
}

.status-message.warning {
    background: rgba(243, 156, 18, 0.2);
    color: #f39c12;
    border-color: rgba(243, 156, 18, 0.3);
}

.status-message.loading {
    background: rgba(52, 152, 219, 0.2);
    color: #3498db;
    border-color: rgba(52, 152, 219, 0.3);
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