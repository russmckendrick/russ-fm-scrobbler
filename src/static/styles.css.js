export const CSS_CONTENT = `/* RUSS FM SCROBBLER - BOOTSTRAP THEME */

/* CSS Variables matching Hugo theme */
:root {
    --dark-navy: #1a1e2e;
    --medium-navy: #2c3141;
    --light-navy: #3d4255;
    --accent-grey: #cccccc;
    --text-light: #e0e0e0;
    --light-accent: #e0e0e0;
    --bs-primary: #1a1e2e;
    --bs-secondary: #6c757d;
}

/* Global font - using Bootstrap default font stack */
body {
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    padding-top: 76px; /* Account for fixed navbar */
}

/* Navbar styling */
.navbar {
    background-color: var(--medium-navy);
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.navbar-brand {
    color: var(--accent-grey);
    font-weight: bold;
    transition: color 0.2s ease-in-out;
}

.navbar-brand:hover {
    color: var(--text-light);
}

.navbar-nav .nav-link {
    color: rgba(224,224,224,0.8);
    transition: color 0.2s ease-in-out;
}

.navbar-nav .nav-link.active {
    color: var(--light-accent);
    font-weight: bold;
}

.navbar-nav .nav-link:hover,
.navbar-nav .nav-link:focus {
    color: var(--text-light);
}

.navbar-toggler {
    border-color: rgba(224,224,224,0.1);
}

.navbar-toggler-icon {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28224, 224, 224, 0.8%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

/* Spinning navbar icon animation */
.navbar-icon {
    animation: spin 4s linear infinite;
    transition: transform 0.3s ease-in-out;
}

.navbar-brand:hover .navbar-icon {
    transform: scale(1.2);
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

/* Jumbotron styling */
.jumbotron-background {
    background-image: url('https://www.russ.fm/images/sticker-clear.svg');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: bottom right;
    background-color: var(--light-navy);
}

/* User header specific styling */
#user-header {
    position: relative;
    overflow: hidden;
}

#user-header::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(61, 66, 85, 0.95) 0%, rgba(61, 66, 85, 0.8) 40%, rgba(61, 66, 85, 0.4) 70%, rgba(61, 66, 85, 0.1) 100%);
    z-index: 1;
}

#user-header .text-container {
    position: relative;
    z-index: 2;
}

#user-header .user-avatar {
    transition: transform 0.3s ease;
    position: relative;
    z-index: 2;
}

#user-header:hover .user-avatar {
    transform: scale(1.05);
}

#user-header .user-stats {
    font-size: 0.9rem;
    opacity: 0.9;
}

#user-header .user-stats i {
    opacity: 0.8;
}

.refresh-artwork-btn {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    color: rgba(255, 255, 255, 0.7);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    z-index: 3;
    cursor: pointer;
}

.refresh-artwork-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    color: rgba(255, 255, 255, 0.9);
    transform: rotate(180deg) scale(1.1);
}

.refresh-artwork-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

/* Pro badge styling */
.pro-badge {
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #1a1e2e;
    font-weight: bold;
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    text-shadow: none;
    box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
    animation: subtle-glow 2s ease-in-out infinite alternate;
}

.pro-badge i {
    color: #1a1e2e;
}

@keyframes subtle-glow {
    from {
        box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
    }
    to {
        box-shadow: 0 2px 8px rgba(255, 215, 0, 0.5);
    }
}

/* Bootstrap component overrides */
.btn-primary {
    background-color: var(--dark-navy);
    border-color: var(--dark-navy);
}

.btn-primary:hover {
    background-color: var(--medium-navy);
    border-color: var(--medium-navy);
}

.btn-secondary {
    background-color: var(--accent-grey);
    border-color: var(--accent-grey);
    color: var(--dark-navy);
}

.btn-secondary:hover {
    background-color: var(--text-light);
    border-color: var(--text-light);
    color: var(--dark-navy);
}

.bg-primary {
    background-color: var(--light-navy) !important;
}

/* Card styling */
.card {
    border: 1px solid rgba(0,0,0,0.125);
    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.card-img-top {
    transition: transform 0.3s ease;
}

.card:hover .card-img-top {
    transform: scale(1.05);
}

/* Form controls */
.form-control:focus {
    border-color: var(--dark-navy);
    box-shadow: 0 0 0 0.2rem rgba(26, 30, 46, 0.25);
}

.form-check-input:checked {
    background-color: var(--dark-navy);
    border-color: var(--dark-navy);
}

/* Loading animation for buttons */
.loading {
    position: relative;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 1rem;
    width: 1rem;
    height: 1rem;
    border: 2px solid rgba(255,255,255,0.3);
    border-top: 2px solid var(--dark-navy);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    transform: translateY(-50%);
}

/* Album result cards */
.album-card {
    transition: box-shadow 0.2s ease;
    cursor: pointer;
}

.album-card:hover {
    box-shadow: 0 0.5rem 1rem rgba(0,0,0,0.15);
}

/* Track list styling */
.track-item {
    padding: 0.75rem;
    border: 1px solid #dee2e6;
    border-radius: 0.375rem;
    margin-bottom: 0.5rem;
    background-color: #f8f9fa;
    transition: all 0.2s ease;
}

.track-item:hover {
    background-color: #e9ecef;
    transform: translateX(5px);
}

.track-item .btn {
    opacity: 0.7;
    transition: opacity 0.2s ease;
}

.track-item:hover .btn {
    opacity: 1;
}

/* Status messages */
.alert {
    border-radius: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 992px) {
    .jumbotron-background {
        background-image: none;
    }
    
    .text-container {
        text-align: center;
        padding: 2rem 1rem;
    }
    
    .text-container h1 {
        font-size: 2rem;
    }
    
    .text-container p {
        font-size: 1.25rem;
    }
}

@media (max-width: 768px) {
    body {
        padding-top: 66px;
    }
    
    .container {
        padding-left: 1rem;
        padding-right: 1rem;
    }
    
    .btn {
        width: 100%;
        margin-bottom: 0.5rem;
    }
    
    .d-flex.gap-2 {
        flex-direction: column;
    }
}

/* Pagination styling */
.pagination .page-link {
    color: var(--dark-navy);
    border-color: #dee2e6;
}

.pagination .page-link:hover {
    color: var(--medium-navy);
    background-color: #e9ecef;
    border-color: #dee2e6;
}

.pagination .page-item.active .page-link {
    background-color: var(--dark-navy);
    border-color: var(--dark-navy);
}

/* Hide text and adjust buttons for mobile devices */
@media (max-width: 768px) {
    .pagination .page-item .page-link span {
        display: none;
    }
    
    .pagination .page-item .page-link[aria-label="Previous"]::before {
        content: "←";
    }
    
    .pagination .page-item .page-link[aria-label="Next"]::after {
        content: "→";
    }
    
    .pagination .page-item .page-link[aria-label="First"]::before {
        content: "<<";
    }
    
    .pagination .page-item .page-link[aria-label="Last"]::after {
        content: ">>";
    }
    
    .pagination .page-link {
        padding: 8px 12px;
    }
}

/* Footer styling */
footer a:hover {
    color: var(--accent-grey) !important;
    text-decoration: none;
}

/* Breadcrumb styling */
.breadcrumb {
    background-color: transparent;
    padding: 0;
    margin: 0;
    font-size: 0.9rem;
}

.breadcrumb-item + .breadcrumb-item::before {
    content: "/";
    color: var(--accent-grey);
    padding: 0 0.5rem;
}

.breadcrumb-item a {
    color: var(--accent-grey);
    text-decoration: none;
    transition: color 0.2s ease;
}

.breadcrumb-item a:hover {
    color: #ffffff;
}

.breadcrumb-item.active {
    color: var(--accent-grey);
}

/* Album Page Layout */
.album-page-container {
    background-color: #ffffff;
    min-height: 100vh;
    color: #333333;
}

.breadcrumb-nav {
    background-color: #f8f9fa;
    padding: 1rem 0;
    border-bottom: 1px solid #dee2e6;
}

.breadcrumb-nav .container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.data-source {
    color: #6c757d;
    font-size: 0.9rem;
}

.album-content {
    padding: 2rem 0;
}

.album-info-card {
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1.5rem;
    margin-bottom: 2rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.album-cover {
    width: 100%;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
}

.album-details {
    margin-bottom: 1.5rem;
}

.album-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333333;
    margin-bottom: 0.5rem;
}

.artist-name {
    font-size: 1.2rem;
    color: #6c757d;
    margin-bottom: 0.5rem;
}

.album-year, .album-format {
    color: #6c757d;
    font-size: 0.9rem;
}

.scrobble-actions .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    font-weight: 500;
}

.scrobble-actions .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
}

.track-list-container {
    background-color: #ffffff;
    border: 1px solid #dee2e6;
    border-radius: 0.5rem;
    padding: 1rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0,0,0,0.075);
}

.track-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #e9ecef;
    transition: background-color 0.2s ease;
}

.track-row:last-child {
    border-bottom: none;
}

.track-row:hover {
    background-color: #f8f9fa;
}

.track-info {
    display: flex;
    align-items: center;
    flex-grow: 1;
}

.track-number {
    background-color: #6c757d;
    color: #ffffff;
    padding: 0.25rem 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.8rem;
    margin-right: 1rem;
    min-width: 2rem;
    text-align: center;
}

.track-title {
    color: #333333;
    font-weight: 500;
    flex-grow: 1;
}

.track-duration {
    color: #6c757d;
    font-size: 0.9rem;
    margin-left: auto;
    margin-right: 1rem;
}

.track-scrobble-btn {
    background-color: #28a745;
    border-color: #28a745;
    color: #ffffff;
    font-size: 0.8rem;
    padding: 0.375rem 0.75rem;
}

.track-scrobble-btn:hover {
    background-color: #218838;
    border-color: #1e7e34;
}

.back-button-container {
    text-align: center;
    margin-top: 2rem;
}

/* Responsive adjustments for album page */
@media (max-width: 768px) {
    .album-content {
        padding: 1rem 0;
    }
    
    .album-info-card {
        margin-bottom: 1rem;
    }
    
    .track-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .track-info {
        width: 100%;
    }
    
    .track-scrobble-btn {
        align-self: flex-end;
    }
    
    .breadcrumb-nav .container {
        flex-direction: column;
        gap: 0.5rem;
    }
}
`; 