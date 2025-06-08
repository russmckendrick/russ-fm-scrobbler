import { handleAuth } from './handlers/auth.js';
import { handleSearch } from './handlers/search.js';
import { handleScrobble } from './handlers/scrobble.js';
import { getStaticAsset } from './utils/static.js';

const ALLOWED_ORIGINS = [
  'http://localhost:8787',
  'https://scrobbler.russ.fm',
  'https://random.russ.fm',
  'https://www.russ.fm',
  'https://russ.fm',
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    const requestOrigin = request.headers.get('Origin');

    // Base CORS headers (excluding ACAO and Vary initially)
    const responseCorsHeaders = {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Conditionally set ACAO and Vary
    if (requestOrigin && ALLOWED_ORIGINS.includes(requestOrigin)) {
      responseCorsHeaders['Access-Control-Allow-Origin'] = requestOrigin;
      responseCorsHeaders['Vary'] = 'Origin'; // Important for caching
    }
    // If requestOrigin is not in ALLOWED_ORIGINS, ACAO is not set.
    // Browsers will block disallowed cross-origin requests.
    // For same-origin or non-browser requests (Origin header not present), ACAO is also not set.

    // Handle preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
      // Preflight response should include ACAO if origin is allowed
      return new Response(null, { headers: responseCorsHeaders });
    }

    try {
      // API Routes
      if (path.startsWith('/api/')) {
        let response;
        
        if (path.startsWith('/api/auth/')) {
          response = await handleAuth(request, env, path);
        } else if (path.startsWith('/api/search/')) {
          response = await handleSearch(request, env, path);
        } else if (path.startsWith('/api/scrobble/')) {
          response = await handleScrobble(request, env, path);
        } else {
          response = new Response('API endpoint not found', { status: 404 });
        }

        // Add CORS headers to the actual response
        Object.entries(responseCorsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }

      // Static file serving
      const staticAssetResponse = await getStaticAsset(path, env);
      Object.entries(responseCorsHeaders).forEach(([key, value]) => {
        staticAssetResponse.headers.set(key, value);
      });
      return staticAssetResponse;

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: responseCorsHeaders // Use the dynamically built CORS headers
      });
    }
  },
}; 