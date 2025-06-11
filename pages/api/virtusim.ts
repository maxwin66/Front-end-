import type { NextApiRequest, NextApiResponse } from 'next';
import { VIRTUSIM_API } from '../../config/api';

// Constants
const CURRENT_TIMESTAMP = '2025-06-11 19:56:55';
const CURRENT_USER = 'lillysummer9794';

interface VirtuSimResponse {
  status: boolean;
  data?: any;
  error?: string;
  timestamp: string;
  user: string;
}

async function makeVirtuSimRequest(action: string, params: Record<string, string> = {}) {
  const apiKey = process.env.NEXT_PUBLIC_VIRTUSIM_API_KEY;
    
  if (!apiKey) {
    throw new Error('API key not configured');
  }

  const queryParams = new URLSearchParams({
    api_key: apiKey,
    action,
    ...params
  });

  const response = await fetch(VIRTUSIM_API.BASE_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/4.0 (compatible; MSIE 5.01; Windows NT 5.0)'
    }
  });

  if (!response.ok) {
    throw new Error(`VirtuSim API error: ${response.statusText}`);
  }

  const data = await response.json();
  return {
    ...data,
    timestamp: CURRENT_TIMESTAMP,
    user: CURRENT_USER
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<VirtuSimResponse>) {
  const { method, query } = req;

  try {
    // GET /api/virtusim/services
    if (method === 'GET' && query.action === 'services') {
      const country = (query.country as string)?.toLowerCase() || 'indonesia';
      const service = query.service as string || 'wa';
      
      const data = await makeVirtuSimRequest('services', { 
        country,
        service 
      });
      
      return res.status(200).json({
        status: true,
        data: Array.isArray(data.data) ? data.data.map((service: any) => ({
          service_id: service.id,
          name: service.name,
          description: service.description || '',
          country: country,
          country_code: country.toUpperCase().slice(0, 2),
          price: parseFloat(service.price),
          price_formatted: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
          }).format(parseFloat(service.price)),
          available_numbers: service.available || 0,
          status: service.status?.toLowerCase() || 'unavailable',
          duration: service.duration || '30 minutes',
          category: service.category || 'standard',
          is_premium: parseFloat(service.price) > 10000
        })) : [],
        timestamp: CURRENT_TIMESTAMP,
        user: CURRENT_USER
      });
    }

    // GET /api/virtusim/purchase
    if (method === 'GET' && query.action === 'purchase') {
      const { service_id, current_credits } = query;
      if (!service_id) {
        throw new Error('Service ID is required');
      }

      const data = await makeVirtuSimRequest('purchase', { 
        id: service_id as string
      });

      const credits_left = parseInt(current_credits as string) - (data.price || 0);

      return res.status(200).json({
        status: true,
        data: {
          order_id: data.id || '',
          phone_number: data.phone_number || '',
          credits_left,
          activation_time: CURRENT_TIMESTAMP,
          expiry_time: new Date(Date.now() + 30 * 60000).toISOString()
        },
        timestamp: CURRENT_TIMESTAMP,
        user: CURRENT_USER
      });
    }

    // GET /api/virtusim/numbers
    if (method === 'GET' && query.action === 'numbers') {
      const data = await makeVirtuSimRequest('numbers');
      
      return res.status(200).json({
        status: true,
        data: Array.isArray(data.data) ? data.data.map((number: any) => ({
          id: number.id,
          phone_number: number.number,
          country_code: number.country || 'ID',
          status: number.status?.toLowerCase() || 'expired',
          activation_date: number.activated_at || CURRENT_TIMESTAMP,
          expiry_date: number.expires_at || new Date(Date.now() + 30 * 60000).toISOString(),
          sms_received: number.messages_count || 0,
          service_name: number.service_name || 'WhatsApp'
        })) : [],
        timestamp: CURRENT_TIMESTAMP,
        user: CURRENT_USER
      });
    }

    // GET /api/virtusim/sms
    if (method === 'GET' && query.action === 'sms') {
      const numberId = query.number_id;
      if (!numberId) {
        throw new Error('Number ID is required');
      }

      const data = await makeVirtuSimRequest('sms', { 
        id: numberId as string 
      });
      
      return res.status(200).json({
        status: true,
        data: {
          messages: Array.isArray(data.messages) ? data.messages.map((msg: any) => ({
            id: msg.id || '',
            text: msg.text || '',
            sender: msg.sender || 'Unknown',
            received_at: msg.received_at || CURRENT_TIMESTAMP
          })) : []
        },
        timestamp: CURRENT_TIMESTAMP,
        user: CURRENT_USER
      });
    }

    // Handle unsupported methods/actions
    return res.status(400).json({
      status: false,
      error: 'Invalid request method or action',
      timestamp: CURRENT_TIMESTAMP,
      user: CURRENT_USER
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return res.status(500).json({
      status: false,
      error: error.message || 'Internal server error',
      timestamp: CURRENT_TIMESTAMP,
      user: CURRENT_USER
    });
  }
        }
