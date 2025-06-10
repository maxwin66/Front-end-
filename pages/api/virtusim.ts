import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: false,
      message: 'Method not allowed',
      timestamp: "2025-06-10 23:23:09",
      user: "lillysummer9794"
    });
  }

  const { country = 'Indonesia' } = req.query;

  try {
    const params = new URLSearchParams({
      api_key: process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY || '',
      action: 'getServices',
      country: country as string,
      status: 'all'
    });

    const response = await fetch(
      `https://virtusim.com/api/v2/json.php?${params.toString()}`
    );

    const data = await response.json();

    return res.status(200).json({
      ...data,
      timestamp: "2025-06-10 23:23:09",
      user: "lillysummer9794"
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      timestamp: "2025-06-10 23:23:09",
      user: "lillysummer9794"
    });
  }
}
