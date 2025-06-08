# Russ FM Scrobbler - Project Plan

## Overview
A web application hosted on Cloudflare Workers at https://scrobbler.russ.fm/ that allows users to search for albums using the Discogs API and scrobble them to LastFM. The app will feature a clean, minimalist design inspired by https://random.russ.fm/.

## Project Structure

### 1. Technology Stack
- **Frontend**: HTML, CSS, JavaScript (vanilla or lightweight framework)
- **Backend**: Cloudflare Workers (JavaScript/TypeScript)
- **APIs**: 
  - Discogs API for album search
  - LastFM API for authentication and scrobbling
- **Hosting**: Cloudflare Workers
- **Domain**: scrobbler.russ.fm

### 2. Core Features

#### 2.1 User Authentication
- LastFM OAuth integration
- Session management using Cloudflare Workers KV storage
- Secure token handling

#### 2.2 Search Functionality
- Search by Discogs release ID (direct lookup)
- Search by artist name and release name
- Display search results with album artwork, artist, title, year
- Pagination for search results

#### 2.3 Scrobbling
- Display track listing for selected album
- Allow users to scrobble entire album or individual tracks
- Real-time scrobbling status feedback
- Scrobble history/confirmation

### 3. Design & UI

#### 3.1 Design Inspiration
Based on https://random.russ.fm/ style:
- Clean, minimal layout
- Monospace or simple typography
- High contrast (likely dark theme)
- Brutalist/utilitarian aesthetic
- Simple navigation
- Focus on functionality over decoration

#### 3.2 Layout Structure
```
Header
├── Site title/logo
├── User status (logged in/out)
└── Navigation

Main Content
├── Search Section
│   ├── Search type selector (Release ID / Artist + Album)
│   ├── Search inputs
│   └── Search button
├── Results Section
│   ├── Album grid/list
│   └── Pagination
└── Selected Album Section
    ├── Album details
    ├── Track listing
    └── Scrobble controls

Footer
├── About/Help
└── API credits
```

### 4. Implementation Tasks

#### Phase 1: Project Setup & Infrastructure
1. **Initialize Cloudflare Workers project**
   - Set up wrangler CLI
   - Configure worker script
   - Set up custom domain routing

2. **Environment Configuration**
   - Set up environment variables for API keys
   - Configure KV namespace for session storage
   - Set up CORS policies

3. **Basic HTML/CSS Framework**
   - Create responsive layout
   - Implement design system based on reference site
   - Set up CSS variables for theming

#### Phase 2: API Integration
1. **Discogs API Integration**
   - Implement search by release ID
   - Implement search by artist + album name
   - Handle API rate limiting
   - Parse and format response data

2. **LastFM API Integration**
   - Implement OAuth flow
   - Session management
   - Scrobbling endpoints
   - User profile data

#### Phase 3: Frontend Development
1. **Search Interface**
   - Search form with multiple input types
   - Real-time search suggestions (if needed)
   - Loading states and error handling

2. **Results Display**
   - Album cards with artwork
   - Responsive grid layout
   - Pagination controls

3. **Album Detail View**
   - Full album information
   - Track listing
   - Scrobble controls

#### Phase 4: Scrobbling Functionality
1. **Track Selection**
   - Individual track scrobbling
   - Bulk album scrobbling
   - Timestamp handling

2. **Scrobble Management**
   - Queue system for multiple scrobbles
   - Error handling and retry logic
   - Success/failure feedback

#### Phase 5: Polish & Optimization
1. **Performance Optimization**
   - Image optimization
   - Caching strategies
   - Bundle size optimization

2. **User Experience**
   - Keyboard shortcuts
   - Accessibility improvements
   - Mobile responsiveness

3. **Error Handling**
   - Comprehensive error messages
   - Fallback states
   - API failure recovery

### 5. File Structure
```
/
├── src/
│   ├── worker.js (main Cloudflare Worker script)
│   ├── handlers/
│   │   ├── auth.js (LastFM OAuth)
│   │   ├── search.js (Discogs search)
│   │   └── scrobble.js (LastFM scrobbling)
│   ├── utils/
│   │   ├── api.js (API helpers)
│   │   ├── cache.js (caching utilities)
│   │   └── validation.js (input validation)
│   └── static/
│       ├── index.html
│       ├── styles.css
│       ├── script.js
│       └── assets/
├── wrangler.toml (Cloudflare configuration)
├── package.json
└── README.md
```

### 6. API Requirements

#### 6.1 Discogs API
- **Endpoints needed**:
  - `/releases/{release_id}` - Get release by ID
  - `/database/search` - Search releases
- **Rate limits**: 60 requests per minute
- **Authentication**: User-Agent header required

#### 6.2 LastFM API
- **Endpoints needed**:
  - `auth.getToken` - Get authentication token
  - `auth.getSession` - Get session key
  - `track.scrobble` - Scrobble tracks
  - `user.getInfo` - Get user info
- **Rate limits**: No official limit, but be respectful
- **Authentication**: API key + session key

### 7. Security Considerations
- Secure API key storage in Cloudflare environment variables
- HTTPS enforcement
- Input validation and sanitization
- Rate limiting protection
- Session security

### 8. Testing Strategy
- Unit tests for utility functions
- Integration tests for API endpoints
- Manual testing for user flows
- Cross-browser compatibility testing

### 9. Deployment Plan
1. Set up Cloudflare Workers environment
2. Configure custom domain (scrobbler.russ.fm)
3. Deploy initial version
4. Set up monitoring and logging
5. Gradual feature rollout

### 10. Future Enhancements
- Playlist creation from scrobbled albums
- Social features (sharing scrobbles)
- Advanced search filters
- Scrobble statistics and analytics
- Mobile app (PWA)
- Integration with other music services

## Success Criteria
- Users can successfully authenticate with LastFM
- Users can search for albums using both Discogs search methods
- Users can scrobble individual tracks or entire albums
- Application loads quickly and works on mobile devices
- Clean, functional design that matches the aesthetic of the reference site
- Reliable error handling and user feedback

This plan provides a solid foundation for building a robust, user-friendly scrobbling application that meets all the specified requirements while maintaining the aesthetic and functional goals of the project. 