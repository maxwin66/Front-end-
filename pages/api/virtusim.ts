import type { NextApiRequest, NextApiResponse } from 'next';

const TIMESTAMP = '2025-06-11 22:26:05';
const USER = 'lillysummer9794';

// Simple rate limiting implementation
const RATE_LIMIT_DURATION = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;
const ipRequests = new Map<string, { count: number; timestamp: number }>();

// Cache configuration
const CACHE_DURATION = 60 * 1000; // 1 minute
const cache = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const requestData = ipRequests.get(ip);

  if (!requestData) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (now - requestData.timestamp > RATE_LIMIT_DURATION) {
    ipRequests.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (requestData.count >= MAX_REQUESTS) {
    return false;
  }

  requestData.count++;
  return true;
}

// Clean up expired rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  Array.from(ipRequests.keys()).forEach(ip => {
    const data = ipRequests.get(ip);
    if (data && now - data.timestamp > RATE_LIMIT_DURATION) {
      ipRequests.delete(ip);
    }
  });
}, 60 * 60 * 1000);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins for now
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours

  // Handle OPTIONS request first
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Only allow GET requests for API calls
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: false,
        error: 'Method not allowed',
        timestamp: TIMESTAMP,
        user: USER
      });
    }

    // Check rate limit
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
                    req.socket.remoteAddress || 
                    'unknown';
                    
    if (!checkRateLimit(clientIp)) {
      return res.status(429).json({
        status: false,
        error: 'Too many requests. Please try again later.',
        timestamp: TIMESTAMP,
        user: USER
      });
    }

    const { query } = req;
    
    // Validate required parameters
    if (!query.api_key || !query.action) {
      return res.status(400).json({
        status: false,
        error: 'Missing required parameters',
        timestamp: TIMESTAMP,
        user: USER
      });
    }

    // Create cache key from query parameters
    const cacheKey = JSON.stringify(query);
    
    // Check cache first
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      console.log('Returning cached response for IP:', clientIp);
      return res.status(200).json({
        ...cachedResponse,
        timestamp: TIMESTAMP,
        user: USER,
        cached: true
      });
    }

    // Construct API URL
    const apiUrl = `https://virtusim.com/api/v2/json.php?${new URLSearchParams(query as any).toString()}`;

    // Make request to Virtusim API with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    console.log('Making request to Virtusim API for IP:', clientIp);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
        'Authorization': `Bearer ${process.env.VIRTUSIM_SERVER_API_KEY}`
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        timestamp: TIMESTAMP,
        clientIp
      });

      throw new Error(`API returned ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Validate response structure
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid response format from API');
    }

    // Cache the successful response
    cache.set(cacheKey, data);
    setTimeout(() => cache.delete(cacheKey), CACHE_DURATION);

    console.log('Successful API response for IP:', clientIp);

    // Send response
    res.status(200).json({
      ...data,
      timestamp: TIMESTAMP,
      user: USER
    });

  } catch (error) {
    // Log error for debugging
    console.error('Proxy Error:', error);

    // Clear cache on error
    cache.clear();

    // Send error response
    res.status(500).json({ 
      status: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      timestamp: TIMESTAMP,
      user: USER
    });
  }
}

// Configure API route options
export const config = {
  api: {
    bodyParser: true, // Enable body parser for better error handling
    externalResolver: true // Use external resolver
  }
};
