// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import CONSTANTS from '@/constants/constants';

const RO_API_KEY = '453da4be0759767e21f34c688dcf8494';

//data untuk ngeresponse
export type Data = {
  message?: string;
  error?: boolean;
  data?: undefined;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const { provinceId } = req.query;
  if (req.method === 'GET') {
    axios.defaults.headers['X-API-KEY'] = RO_API_KEY;
    try {
      const response = await axios({
        headers: {
          key: RO_API_KEY,
        },
        method: 'GET',
        url: `${CONSTANTS.RO_BASEURL}/city?province=${provinceId}`,
      });
      if (response.status === 200) {
        res.status(200).json({
          error: false,
          data: response.data,
        });
      }
    } catch (error) {
      res.status(400).json({
        error: true,
      });
    }
  }
}
