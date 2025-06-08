# Russ FM Scrobbler

A web application for searching albums on Discogs and scrobbling them to Last.fm. Built with Cloudflare Workers and featuring a functional and minimalist design aesthetic.

## Features

- **LastFM Authentication**: Secure OAuth integration with session management
- **Discogs Search**: Search by release ID or artist/album name
- **Scrobbling**: Individual track or full album scrobbling to Last.fm
- **Responsive Design**: Clean, functional interface that works on all devices
- **Fast Performance**: Powered by Cloudflare Workers edge computing

## Prerequisites

- Node.js 18+ and npm
- Cloudflare account with Workers enabled
- Last.fm API account
- Discogs API account

## Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd russ-fm-scrobbler
npm install
```

### 2. API Keys Setup

#### Last.fm API
1. Go to [Last.fm API](https://www.last.fm/api/account/create)
2. Create a new application
3. Note down your API Key and Shared Secret

#### Discogs API
1. Go to [Discogs Developer Settings](https://www.discogs.com/settings/developers)
2. Create a new application
3. Note down your Consumer Key and Consumer Secret

### 3. Environment Configuration

Set up your secrets using Wrangler CLI:

```bash
# Last.fm credentials
npx wrangler secret put LASTFM_API_KEY
npx wrangler secret put LASTFM_SECRET

# Discogs credentials  
npx wrangler secret put DISCOGS_API_KEY
npx wrangler secret put DISCOGS_SECRET
```


### 4. Configure CORS Origins

This application uses a CORS (Cross-Origin Resource Sharing) policy to control which websites can access its API. You need to configure the allowed origins in your `wrangler.toml` file.

The `ALLOWED_ORIGINS_STRING` variable should be set under `[env.development.vars]` for your local development environment and `[env.production.vars]` for your deployed application. This variable takes a comma-separated string of URLs.

**Example for `wrangler.toml`:**

```toml
[env.development.vars]
ENVIRONMENT = "development"
# Allow only local development server for testing
ALLOWED_ORIGINS_STRING = "http://localhost:8787"

[env.production.vars]
ENVIRONMENT = "production"
# Allow your production domains
ALLOWED_ORIGINS_STRING = "https://scrobbler.russ.fm,https://random.russ.fm,https://www.russ.fm,https://russ.fm"
```

Adjust these values to match your specific frontend URLs.

### 5. KV Namespace Setup

Create a KV namespace for session storage:

```bash
npx wrangler kv:namespace create "SESSIONS"
npx wrangler kv:namespace create "SESSIONS" --preview
```

Update the `wrangler.toml` file with the namespace IDs returned by the commands above.

### 6. Domain Configuration

Update `wrangler.toml` to use your domain:

```toml
[env.production]
name = "russ-fm-scrobbler"
route = "your-domain.com/*"
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:8787`

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Usage

1. **Authentication**: Click "LOGIN TO LAST.FM" to authenticate with your Last.fm account
2. **Search**: 
   - Use Discogs Release ID for direct album lookup
   - Or search by Artist + Album name
3. **Select Album**: Click on any search result to view detailed album information
4. **Scrobble**: 
   - Scrobble individual tracks using the track buttons
   - Or scrobble the entire album at once

## API Endpoints

### Authentication
- `POST /api/auth/login` - Initiate Last.fm OAuth
- `POST /api/auth/callback` - Handle OAuth callback
- `GET /api/auth/status` - Check authentication status
- `POST /api/auth/logout` - Logout user

### Search
- `GET /api/search/discogs` - Search Discogs database (supports `releaseId` or `artist` & `album` query params)
- `GET /api/search/discogs/release/{id}` - Get Discogs release details
- `GET /api/search/lastfm` - Search Last.fm (supports `artist`, `album`, or `track` query params)
- `GET /api/search/lastfm/album` - Get Last.fm album details (supports `artist` & `album` query params)

### Scrobbling
- `POST /api/scrobble/track` - Scrobble single track
- `POST /api/scrobble/album` - Scrobble entire album

## Architecture

```
src/
├── worker.js              # Main Cloudflare Worker entry point
├── handlers/
│   ├── auth.js           # Last.fm authentication
│   ├── search.js         # Discogs API integration
│   └── scrobble.js       # Last.fm scrobbling
├── utils/
│   ├── static.js         # Static file serving
│   └── lastfm.js         # Last.fm utilities
└── static/
    ├── index.html.js     # Main HTML template
    ├── styles.css.js     # Core CSS styles
    └── script.js.js      # Frontend JavaScript
```

## Security Features

- **HttpOnly Cookies**: Session cookies are secure and HttpOnly
- **CORS Protection**: Proper CORS headers for API endpoints
- **Session Expiration**: 24-hour session timeout
- **API Signature Validation**: All Last.fm API calls are properly signed

## Rate Limiting


## Embeddable Scrobble Popup

You can now open a streamlined popup to scrobble a Discogs album from your own site:

**How to use:**

```js
window.open('https://scrobbler.russ.fm/embed/34191121/', 'russFMScrobbler', 'width=400,height=500');
```
Replace `34191121` with the Discogs release ID you want to scrobble.

- The popup will prompt login if needed, load the album, scrobble automatically, and close itself.
- If the window cannot close automatically (e.g., popup blockers), a Close button is shown.
- The UI is minimal, centered, and headerless for seamless embedding.

**CORS:**
- Make sure `russ.fm` is in your `ALLOWED_ORIGINS_STRING` in `wrangler.toml` for proper embedding.

---

The application respects API rate limits:
- **Discogs**: 60 requests per minute for authenticated requests
- **Last.fm**: 5 requests per second, 300 requests per 15 minutes

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Check the [Issues](https://github.com/yourusername/russ-fm-scrobbler/issues) page
- Review the [Last.fm API Documentation](https://www.last.fm/api)
- Review the [Discogs API Documentation](https://www.discogs.com/developers/)

## Acknowledgments

- **Last.fm** for the scrobbling API
- **Discogs** for the music database API
- **Cloudflare** for the Workers platform