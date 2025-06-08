export async function handleSearch(request, env, path) {
  const url = new URL(request.url);
  
  if (path.startsWith('/api/search/discogs/release/')) {
    const releaseId = path.split('/').pop();
    return handleReleaseDetails(releaseId, env);
  } else if (path === '/api/search/discogs') {
    return handleDiscogsSearch(url, env);
  }
  
  return new Response('Search endpoint not found', { status: 404 });
}

async function handleDiscogsSearch(url, env) {
  try {
    const releaseId = url.searchParams.get('releaseId');
    const artist = url.searchParams.get('artist');
    const album = url.searchParams.get('album');
    const page = parseInt(url.searchParams.get('page')) || 1;
    
    if (releaseId) {
      // Direct release lookup
      return handleReleaseDetails(releaseId, env);
    } else if (artist && album) {
      // Search by artist and album
      return searchByArtistAlbum(artist, album, page, env);
    } else {
      return Response.json({ 
        error: 'Missing search parameters' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Search error:', error);
    return Response.json({ 
      error: 'Search failed' 
    }, { status: 500 });
  }
}

async function handleReleaseDetails(releaseId, env) {
  try {
    const response = await fetch(
      `https://api.discogs.com/releases/${releaseId}`,
      {
        headers: {
          'User-Agent': 'RussFMScrobbler/1.0',
          'Authorization': `Discogs key=${env.DISCOGS_API_KEY}, secret=${env.DISCOGS_SECRET || ''}`
        }
      }
    );
    
    if (!response.ok) {
      if (response.status === 404) {
        return Response.json({ 
          error: 'Release not found' 
        }, { status: 404 });
      } else if (response.status === 429) {
        return Response.json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }, { status: 429 });
      } else {
        return Response.json({ 
          error: 'Failed to fetch release details' 
        }, { status: response.status });
      }
    }
    
    const data = await response.json();
    
    // Transform the data to a consistent format
    const transformedData = {
      id: data.id,
      title: data.title,
      artists: data.artists || [],
      year: data.year,
      genres: data.genres || [],
      styles: data.styles || [],
      formats: data.formats || [],
      labels: data.labels || [],
      tracklist: data.tracklist || [],
      images: data.images || [],
      uri: data.uri,
      resource_url: data.resource_url
    };
    
    return Response.json(transformedData);
  } catch (error) {
    console.error('Release details error:', error);
    return Response.json({ 
      error: 'Failed to fetch release details' 
    }, { status: 500 });
  }
}

async function searchByArtistAlbum(artist, album, page, env) {
  try {
    const perPage = 20;
    const query = `artist:"${artist}" release_title:"${album}"`;
    
    const searchUrl = new URL('https://api.discogs.com/database/search');
    searchUrl.searchParams.set('q', query);
    searchUrl.searchParams.set('type', 'release');
    searchUrl.searchParams.set('page', page.toString());
    searchUrl.searchParams.set('per_page', perPage.toString());
    
    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'RussFMScrobbler/1.0',
        'Authorization': `Discogs key=${env.DISCOGS_API_KEY}, secret=${env.DISCOGS_SECRET || ''}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        return Response.json({ 
          error: 'Rate limit exceeded. Please try again later.' 
        }, { status: 429 });
      } else {
        return Response.json({ 
          error: 'Search failed' 
        }, { status: response.status });
      }
    }
    
    const data = await response.json();
    
    // Transform results to consistent format
    const transformedResults = data.results.map(result => ({
      id: result.id,
      title: result.title,
      artist: extractArtistName(result.title),
      year: result.year,
      format: result.format || [],
      label: result.label || [],
      genre: result.genre || [],
      style: result.style || [],
      thumb: result.thumb,
      uri: result.uri,
      resource_url: result.resource_url,
      master_id: result.master_id,
      master_url: result.master_url
    }));
    
    return Response.json({
      results: transformedResults,
      pagination: {
        page: data.pagination.page,
        pages: data.pagination.pages,
        per_page: data.pagination.per_page,
        items: data.pagination.items,
        urls: data.pagination.urls
      }
    });
  } catch (error) {
    console.error('Artist/album search error:', error);
    return Response.json({ 
      error: 'Search failed' 
    }, { status: 500 });
  }
}

function extractArtistName(title) {
  // Discogs titles are usually in format "Artist - Album Title"
  const parts = title.split(' - ');
  if (parts.length >= 2) {
    return parts[0].trim();
  }
  return 'Unknown Artist';
} 