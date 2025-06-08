# Embed Feature Plan for russFM Scrobbler

## Overview
Implement an embeddable, streamlined popup for scrobbling Discogs albums via a new `/embed/:discogsId/` route. This popup will:
- Auto-authenticate (prompt login if needed)
- Fetch album data
- Auto-scrobble to Last.fm
- Show a centered, headerless card with progress
- Close automatically on completion or error

## Steps

### 1. New Route
- Add `/embed/:discogsId/` route
- Minimal UI: no header/nav, only a centered card
- Accept Discogs ID from URL

### 2. Authentication Handling
- Check if user is authenticated
- If not, redirect to login (optionally, in the same popup)
- After login, return to `/embed/:discogsId/`

### 3. Album Data Fetch
- On mount, fetch album details using Discogs ID (reuse existing API logic)
- Show loading/progress indicator

### 4. Auto-Scrobble
- Once album data is loaded and user is authenticated, trigger scrobble action automatically
- Show progress (e.g., "Scrobbling...", success, or error)

### 5. Auto-Close
- On success or error, show result for a brief moment (e.g., 2 seconds)
- Then close the popup window using `window.close()`
- If not allowed (e.g., popup blockers), show a button to close manually

### 6. UI/UX
- No header/nav/footer
- Centered card with progress and status
- Responsive, clean, minimal design

### 7. Integration
- Document how to open the popup from your main site:
  - Use `window.open('https://scrobbler.russ.fm/embed/34191121/', 'russFMScrobbler', 'width=400,height=500')`
  - Replace Discogs ID as needed

### 8. Security/CORS
- Ensure CORS and session handling allow embedding from `russ.fm`
- No sensitive data exposed to embedding page

### 9. README Update
- Add usage/integration instructions for the embed feature

## Notes
- Reuse existing authentication and album fetching logic
- Avoid duplicating UI code—use a dedicated Embed component if possible
- Test for popup blockers and fallback UI
- Ensure accessibility and mobile-friendliness

---

This plan covers the technical and UX steps to deliver an embeddable, streamlined scrobbling popup as described.
