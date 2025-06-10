import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    // Menggunakan POST method sesuai contoh PHP
    const response = await fetch('https://virtusim.com/api/json.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
      },
      body: new URLSearchParams({
        api_key: apiKey,
        action: 'services'
      })
    });

    const data = await response.json();
    console.log('API Response:', data);

    return res.status(200).json({
      ...data,
      timestamp: '2025-06-10 23:47:44',
      user: 'lillysummer9794'
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      status: false,
      error: error.message,
      timestamp: '2025-06-10 23:47:44',
      user: 'lillysummer9794'
    });
  }
}
