import type { NextApiRequest, NextApiResponse } from 'next';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

const TIMESTAMP = '2025-06-11 22:04:18';
const USER = 'lillysummer9794';

// Rate limiting setup
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware wrapper
const applyMiddleware = (middleware: any) => (request: NextApiRequest, response: NextApiResponse) =>
  new Promise((resolve, reject) => {
    middleware(request, response, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

// Configure CORS
const corsMiddleware = cors({
  origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://front-end-bpup.vercel.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
});

// Cache configuration
const CACHE_DURATION = 60 * 1000; // 1 minute
const cache = new Map();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // Apply middlewares
    await applyMiddleware(corsMiddleware)(req, res);
    await applyMiddleware(limiter)(req, res);

    // Only allow GET requests
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: false,
        error: 'Method not allowed',
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
      console.log('Returning cached response');
      return res.status(200).json({
        ...cachedResponse,
        timestamp: TIMESTAMP,
        user: USER,
        cached: true
      });
    }

    // Construct API URL
    const apiUrl = `https://virtusim.com/api/v2/json.php?${new URLSearchParams(query as any).toString()}`;

    // Make request to Virtusim API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)',
        'Authorization': `Bearer ${process.env.VIRTUSIM_SERVER_API_KEY}`
      },
      timeout: 10000 // 10 seconds timeout
    });

    if (!response.ok) {
      // Log error details
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        timestamp: TIMESTAMP
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
    bodyParser: false, // Disable body parser
    externalResolver: true // Use external resolver
  }
};
