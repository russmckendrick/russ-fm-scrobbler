import { handleAuth } from './handlers/auth.js';
import { handleSearch } from './handlers/search.js';
import { handleScrobble } from './handlers/scrobble.js';
import { getStaticAsset } from './utils/static.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
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

        // Add CORS headers to API responses
        Object.entries(corsHeaders).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
        
        return response;
      }

      // Static file serving
      return await getStaticAsset(path, env);

    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: corsHeaders
      });
    }
  },
}; 