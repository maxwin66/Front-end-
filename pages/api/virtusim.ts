import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method !== 'GET') {
    return res.status(405).json({ status: false, data: { msg: 'Method not allowed' } });
  }

  const { country } = req.query;
  
  try {
    // Gunakan environment variable yang benar (tanpa NEXT_PUBLIC_)
    const apiKey = process.env.VIRTUSIM_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured');
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      action: 'services',
      service: 'Whatsapp',
      country: country?.toString() || ''
    });

    const apiUrl = `https://virtusim.com/api/v2/json.php?${params}`;
    console.log('Fetching from:', apiUrl); // Debug log

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      status: false, 
      data: { msg: 'Failed to fetch services' } 
    });
  }
}
