import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { country } = req.query;
  
  try {
    const apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        status: false, 
        data: { msg: 'API key not configured' },
        timestamp: "2025-06-10 23:07:10",
        user: "lillysummer9794"
      });
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      action: 'services',
      service: 'Whatsapp',
      country: typeof country === 'string' ? country : 'Indonesia'
    });

    const apiUrl = `https://virtusim.com/api/v2/json.php?${params}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && typeof data.status === 'boolean' && Array.isArray(data.data)) {
      return res.status(200).json({
        ...data,
        timestamp: "2025-06-10 23:07:10",
        user: "lillysummer9794"
      });
    }

    return res.status(400).json({
      status: false,
      data: { msg: 'Invalid API response format' },
      timestamp: "2025-06-10 23:07:10",
      user: "lillysummer9794"
    });

  } catch (error: any) {
    return res.status(500).json({ 
      status: false, 
      data: { msg: error.message },
      timestamp: "2025-06-10 23:07:10",
      user: "lillysummer9794"
    });
  }
}
