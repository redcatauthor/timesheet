const ALLOWED_ORIGIN = 'https://redcatauthor.github.io';

export default {
  async fetch(request) {
    const origin = request.headers.get('Origin') || '';

    // Only allow requests from your GitHub Pages domain
    const isAllowed = origin === ALLOWED_ORIGIN || origin === '';

    if (!isAllowed) {
      return new Response('Forbidden', { status: 403 });
    }

    const corsOrigin = origin || ALLOWED_ORIGIN;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': corsOrigin,
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type, Notion-Version',
        }
      });
    }

    // Forward the request to Notion
    const url = new URL(request.url);
    const notionUrl = 'https://api.notion.com' + url.pathname + url.search;

    const response = await fetch(notionUrl, {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' ? request.body : undefined,
    });

    // Add CORS headers to the response
    const newResponse = new Response(response.body, response);
    newResponse.headers.set('Access-Control-Allow-Origin', corsOrigin);
    return newResponse;
  }
};
