import type { NextApiRequest, NextApiResponse } from 'next';
import CONSTANTS from '@/constants/constants';
import { IAuthReturnData } from '@/interface/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<IAuthReturnData>,
) {
  const body = req.body;
  try {
    const response = await fetch(`${CONSTANTS.BASEURL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    if (!response.ok) {
      const responseAPI = {
        error: true,
        status: response.status,
        data: data,
        message: response.statusText,
      };
      res.json(responseAPI);
      return;
    }
    const responseAPI = {
      error: false,
      status: response.status,
      data: data,
      message: response.statusText,
    };
    res.json(responseAPI);
  } catch (error: any) {
    const responseAPI = {
      error: true,
      status: error.response.status,
      data: null,
      message: error.response.statusText,
    };
    res.json(responseAPI);
  }
}
