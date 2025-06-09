import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // Ubah ke string
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
    console.log('API Key exists:', !!apiKey); 

    if (!apiKey) {
      console.error('Missing API key');
      return res.status(500).json({ 
        status: false, 
        data: { msg: 'API key not configured' } 
      });
    }

    const params = new URLSearchParams({
      api_key: apiKey,
      action: 'services',
      service: 'Whatsapp',
      country: typeof country === 'string' ? country : ''
    });

    const apiUrl = `https://virtusim.com/api/v2/json.php?${params}`;
    console.log('Requesting URL:', apiUrl.replace(apiKey, '[HIDDEN]')); 

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('VirtuSIM Response Status:', response.status);

    const data = await response.json();
    console.log('VirtuSIM Response Data:', data);

    return res.status(200).json(data);

  } catch (error: any) {
    console.error('API Route Error:', error.message);
    return res.status(500).json({ 
      status: false, 
      data: { 
        msg: 'Failed to fetch services',
        error: error.message
      } 
    });
  }
}
