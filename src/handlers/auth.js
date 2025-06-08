import { generateSessionId, createAuthUrl, generateApiSig } from '../utils/lastfm.js';

export async function handleAuth(request, env, path) {
  const url = new URL(request.url);
  
  if (path === '/api/auth/status') {
    return handleAuthStatus(request, env);
  } else if (path === '/api/auth/login') {
    return handleLogin(request, env);
  } else if (path === '/api/auth/callback') {
    return handleCallback(request, env, url);
  } else if (path === '/api/auth/logout') {
    return handleLogout(request, env);
  }
  
  return new Response('Auth endpoint not found', { status: 404 });
}

async function handleAuthStatus(request, env) {
  try {
    const sessionId = getSessionFromRequest(request);
    
    if (!sessionId) {
      return Response.json({ authenticated: false });
    }
    
    const sessionData = await env.SESSIONS.get(sessionId);
    
    if (!sessionData) {
      return Response.json({ authenticated: false });
    }
    
    const session = JSON.parse(sessionData);
    
    // Check if session is expired (24 hours)
    if (Date.now() - session.created > 24 * 60 * 60 * 1000) {
      await env.SESSIONS.delete(sessionId);
      return Response.json({ authenticated: false });
    }
    
    return Response.json({
      authenticated: true,
      user: {
        username: session.username,
        sessionKey: session.sessionKey
      }
    });
  } catch (error) {
    console.error('Auth status error:', error);
    return Response.json({ authenticated: false });
  }
}

async function handleLogin(request, env) {
  try {
    const sessionId = generateSessionId();
    const authUrl = createAuthUrl(env.LASTFM_API_KEY);
    
    // Store temporary session for callback verification
    await env.SESSIONS.put(sessionId, JSON.stringify({
      type: 'pending',
      created: Date.now()
    }), { expirationTtl: 600 }); // 10 minutes
    
    const response = Response.json({ authUrl });
    
    // Set session cookie
    response.headers.set('Set-Cookie', 
      `session_id=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`
    );
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ error: 'Login failed' }, { status: 500 });
  }
}

async function handleCallback(request, env, url) {
  try {
    const token = url.searchParams.get('token');
    const sessionId = getSessionFromRequest(request);
    
    if (!token || !sessionId) {
      return Response.json({ 
        success: false, 
        error: 'Missing token or session' 
      }, { status: 400 });
    }
    
    // Get session key from LastFM
    const sessionKey = await getSessionKey(token, env.LASTFM_API_KEY, env.LASTFM_SECRET);
    
    if (!sessionKey) {
      return Response.json({ 
        success: false, 
        error: 'Failed to get session key' 
      }, { status: 400 });
    }
    
    // Get user info
    const userInfo = await getUserInfo(sessionKey, env.LASTFM_API_KEY, env.LASTFM_SECRET);
    
    if (!userInfo) {
      return Response.json({ 
        success: false, 
        error: 'Failed to get user info' 
      }, { status: 400 });
    }
    
    // Store authenticated session
    await env.SESSIONS.put(sessionId, JSON.stringify({
      type: 'authenticated',
      username: userInfo.name,
      sessionKey: sessionKey,
      created: Date.now()
    }), { expirationTtl: 86400 }); // 24 hours
    
    return Response.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    return Response.json({ 
      success: false, 
      error: 'Authentication failed' 
    }, { status: 500 });
  }
}

async function handleLogout(request, env) {
  try {
    const sessionId = getSessionFromRequest(request);
    
    if (sessionId) {
      await env.SESSIONS.delete(sessionId);
    }
    
    const response = Response.json({ success: true });
    
    // Clear session cookie
    response.headers.set('Set-Cookie', 
      'session_id=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0'
    );
    
    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return Response.json({ error: 'Logout failed' }, { status: 500 });
  }
}

function getSessionFromRequest(request) {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  
  return cookies.session_id;
}

async function getSessionKey(token, apiKey, secret) {
  try {
    const params = {
      method: 'auth.getSession',
      api_key: apiKey,
      token: token
    };
    
    const signature = generateApiSig(params, secret);
    params.api_sig = signature;
    params.format = 'json';
    
    const response = await fetch('https://ws.audioscrobbler.com/2.0/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    });
    
    const data = await response.json();
    
    if (data.session && data.session.key) {
      return data.session.key;
    }
    
    return null;
  } catch (error) {
    console.error('Get session key error:', error);
    return null;
  }
}

async function getUserInfo(sessionKey, apiKey, secret) {
  try {
    const params = {
      method: 'user.getInfo',
      api_key: apiKey,
      sk: sessionKey
    };
    
    const signature = generateApiSig(params, secret);
    params.api_sig = signature;
    params.format = 'json';
    
    const response = await fetch('https://ws.audioscrobbler.com/2.0/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params)
    });
    
    const data = await response.json();
    
    if (data.user) {
      return data.user;
    }
    
    return null;
  } catch (error) {
    console.error('Get user info error:', error);
    return null;
  }
} 