import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { country } = req.query;
  
  try {
    const params = new URLSearchParams({
      api_key: process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY || '',
      action: 'services',
      service: 'Whatsapp',
      country: country?.toString() || ''
    });

    const response = await fetch(
      `https://virtusim.com/api/v2/json.php?${params}`
    );
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: false, 
      data: { msg: 'Failed to fetch services' } 
    });
  }
}
