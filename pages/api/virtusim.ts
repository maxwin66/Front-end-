import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Update timestamp
  const timestamp = "2025-06-10 23:34:34";
  const user = "lillysummer9794";

  try {
    const { country = 'Russia', service = '' } = req.query;

    const params = new URLSearchParams({
      api_key: process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY || '',
      action: 'services',
      country: country as string,
      service: service as string
    });

    const response = await fetch(`https://virtusim.com/api/v2/json.php?${params}`);
    const data = await response.json();

    return res.status(200).json({
      ...data,
      timestamp,
      user
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      status: false,
      message: 'Failed to fetch services',
      timestamp,
      user
    });
  }
}
